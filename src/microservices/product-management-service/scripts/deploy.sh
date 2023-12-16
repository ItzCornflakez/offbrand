#!/bin/bash

# Function for printing out information to the terminal
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

log "------------------- Deploying P-M-S_service locally -------------------"

# Build the images 
./build_docker_images.sh || error "Failed to build Docker images"

# Go to the root directory
cd ..

# Copy the .env file so it is reachable to the docker-compose file
cp .env ./docker/ || error "Failed to copy .env file"

# Go to the docker-compose file
cd docker/ || error "Failed to change directory to docker/"

# Start the Docker containers
log "Starting the docker containers"
docker-compose up -d || {
    log "Error: Docker Compose up failed"
    rm .env
    exit 1
}

rm .env

# Check which containers are running
log "Running Containers:"
docker ps
echo ""

# Go back to the scripts directory
cd ../scripts/
