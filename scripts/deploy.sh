#!/bin/bash



cd ../src/microservices/product-management-service/scripts

./deploy.sh system-prod

cd ../../catalog-service/scripts

./deploy.sh system-prod

cd ../../../../

docker-compose up -d

docker-compose ps


