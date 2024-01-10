#!/bin/bash
cd ../src/microservices/auth-service/scripts

./deploy.sh

cd ../../order-management-service/scripts

./deploy.sh

cd ../../product-management-service/scripts 

./deploy.sh

cd ../../user-management-service/scripts 

./deploy.sh



cd ../src/microservices/product-management-service/scripts

./deploy.sh system-prod

cd ../../catalog-service/scripts

./deploy.sh system-prod

cd ../../../../

docker-compose up -d

docker-compose ps


