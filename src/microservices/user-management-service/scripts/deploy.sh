#!/bin/bash

set -e

source ./build_docker_images.sh

log() {
    echo ""
    echo "INFO: $1"
    echo ""
}

error() {
    echo ""
    echo "ERROR: $1"
    echo ""
    exit 1
}


deploy_prod_locally() {
    echo "------------------- Deploying U-M-S_service locally in production mode -------------------"

    log "Bulding docker images"

    build_db_image || error "Could not build database image"
    build_app_prod_image || error "Could not build app image with target production"

    log "Done building the docker images"

    #Copy the envrionment file to the docker container so that the app and the database get access to it

    cd ../config/env
    cp .env.production ../../docker/.env
    cd ../../docker

    docker-compose -f docker-compose.production.yml up -d

    rm .env

    # Check which containers are running
    log "Running Containers:"
    docker ps
    echo ""

    cd ../scripts/

    echo "------------------- Done deploying U-M-S_service locally in production mode -------------------"
}

deploy_test_locally(){
    echo "------------------- Running tests -------------------"

    log "Building the MySql image"

    build_db_image || error "Could not build the database image"

    log "Done building the database image"

    #Copy the envrionment file

    cd ../config/env
    cp .env.test ../../docker/.env
    cp .env.test ../../.env
    cd ../../docker

    docker-compose -f docker-compose.testing.yml up -d

    log "Running containers:"
    docker ps
    echo ""

    cd ..

    #Wait for the database container to be ready and start the end 2 end test 
    log "Waiting for the database container to be ready..."
    while ! npm run test:e2e; do
        log "Retrying end-to-end tests after a delay..."
        sleep 2
    done
    
    rm .env

    cd docker/

    #Delete the running test database container
    docker-compose -f docker-compose.testing.yml down -v

    rm .env

    cd ../scripts/

    echo "------------------- Done running tests -------------------"
}

deploy_system_prod(){
    log "Bulding docker images"

    build_db_image || error "Could not build database image"
    build_app_prod_image || error "Could not build app image with target production"

    log "Done building the docker images"
}

if [ $# -eq 0 ]; then
    deploy_prod_locally

elif [ "$1" == "test" ]; then
    deploy_test_locally

elif [ "$1" == "prod" ]; then
    deploy_prod_locally

elif [ "$1" == "system-prod" ]; then
    deploy_system_prod

else
    error "Add 'prod' flag to deploy locally in production mode or 'test' to run the e2e tests (the app is not dockerized here)" 

fi
