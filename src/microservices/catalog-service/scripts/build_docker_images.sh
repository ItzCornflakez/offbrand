#!/bin/bash

# These scripts facilitate the building of Docker images

set -e

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

build_app_prod_image(){
    echo "------------------- Building the Docker image for the app in production mode -------------------"
    
    cd ../docker/app || error "Failed to change directory to ../docker/app"

    #Move the Dockerfile to the source directory
    cp Dockerfile ../../ || error "Failed to copy the app Dockerfile to the root directory"
    cd ../../ || error "Failed to change directory to the root directory"
    
    log "Building the app image with target production"
    docker build . -t "catalog_prod_app" || error "Failed to build the production app image"

    rm Dockerfile || error "Failed to remove the app Dockerfile from the root directory"

    cd scripts/

    echo "------------------- Done building the Docker image for the app in production mode -------------------"
    echo ""

}

build_db_image(){
    echo "------------------- Building the MySql Docker image -------------------"

    cd ../docker/database || error "Failed to change directory to ../docker/database"

    docker build . -t "mysql_image" || error "Failed to build the database image"

    cd ../../scripts

    echo "------------------- Done building the MySql Docker image -------------------"
    echo ""
}