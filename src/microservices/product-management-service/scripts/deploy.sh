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
    echo "------------------- Deploying P-M-S_service locally in production mode -------------------"

    log "Bulding docker images"

    build_db_image || error "Could not build database image"
    build_app_prod_image || error "Could not build app image with target production"

    log "Done building the docker images"

    #Copy the envrionment file

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
}

if [ $# -eq 0 ]; then
    deploy_prod_locally

elif [ "$1" == "test" ]; then
    deploy_test_db_locally

elif [ "$1" == "prod" ]; then
    deploy_prod_locally

else
    error "Add 'prod' flag to deploy locally in production mode or test to deploy the test database (the app is not dockerized)" 

fi
