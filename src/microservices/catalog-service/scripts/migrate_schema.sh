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

if [ -z "$1" ]; then
    migration_name="init"
else
    migration_name=$1
fi


echo "------------------- Migrating prisma database schema -------------------"

log "Building the MySql image"

build_db_image || error "Could not build the database image"

log "Done building the database image"

#Copy the envrionment file

cd ../config/env
cp .env.migrate ../../docker/.env
cp .env.migrate ../../.env
cd ../../docker

docker-compose -f docker-compose.migrate.yml up -d

log "Running containers:"
docker ps
echo ""

cd ..

log "Waiting for the database container to be ready..."
while ! npx prisma migrate dev --name ${migration_name}; do
    log "The database is not ready yet! Retrying schema migrations after a delay..."
    sleep 2
done

rm .env

cd docker/

#Delete the running test database container
docker-compose -f docker-compose.migrate.yml down -v

rm .env

cd ../scripts/

echo "------------------- Done migrating prisma database schema -------------------"
