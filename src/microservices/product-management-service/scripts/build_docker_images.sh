#!/bin/bash

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

log "------------------- Building the docker images -------------------"

cd ../docker/database || error "Failed to change directory to ../docker/database"
log "Building the $DB_IMAGE_NAME image"
docker build . -t "$DB_IMAGE_NAME" || error "Failed to build the database image"

cd ../app || error "Failed to change directory to ../app"
cp Dockerfile ../../
cd ../../

log "Building the $APP_IMAGE_NAME image"
docker build . -t "$APP_IMAGE_NAME" || error "Failed to build the app image"
rm Dockerfile

cd scripts/

log "------------------- Done building the docker images -------------------"
