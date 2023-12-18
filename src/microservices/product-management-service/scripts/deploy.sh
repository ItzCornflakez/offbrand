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

deploy_dev_locally() {
    echo "------------------- Deploying P-M-S_service locally in development mode -------------------"

    log "Bulding docker images"

    build_db_image || error "Could not build database image"
    build_app_dev_image || error "Could not build app image with target development"

    log "Done building the docker images"

    #Copy the envrionment file

    cd ../config/env

    cp .env.development ../../docker/.env

    cd ../../docker

    docker-compose -f docker-compose.development.yml up -d

    rm .env

    # Check which containers are running
    log "Running Containers:"
    docker ps
    echo ""

    cd ../scripts/

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
    deploy_dev_locally

elif [ "$1" == "dev" ]; then
    deploy_dev_locally

elif [ "$1" == "prod" ]; then
    deploy_prod_locally

else
    error "Add 'dev' flag to deploy locally in development mode or 'prod' flag to deploy locally in production mode" 

fi


#log "------------------- Deploying P-M-S_service locally in production mode -------------------"

# Build the images 
#./build_docker_images.sh || error "Failed to build Docker images"

# Go to the root directory
#cd ..

# Copy the .env file so it is reachable to the docker-compose file
#cp .env ./docker/ || error "Failed to copy .env file"

# Go to the docker-compose file
#cd docker/ || error "Failed to change directory to docker/"

# Start the Docker containers
#log "Starting the docker containers"
#docker-compose up -d || {
#    log "Error: Docker Compose up failed"
#    rm .env
#    exit 1
#}

#rm .env

# Check which containers are running
#log "Running Containers:"
#docker ps
#echo ""

# Go back to the scripts directory
#cd ../scripts/
