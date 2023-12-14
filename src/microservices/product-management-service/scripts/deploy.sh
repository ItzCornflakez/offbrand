#!/bin/bash

# Function for printing out information to the terminal
log() {
    echo ""
    echo "$1"
    echo ""
}

# Navigate to the project directory
cd ..

# Build the Dockerfiles
log "Building the Dockerfiles"
docker build . -t offbrand_product-management-service || {
    log "Error: Docker build failed"
    exit 1
}
log "Done Building the Dockerfile"

# Start the Docker containers
log "Starting Docker containers"
docker-compose up -d || {
    log "Error: Docker Compose up failed"
    exit 1
}
echo ""

# Check which containers are running
log "Running Containers:"
docker ps
echo ""