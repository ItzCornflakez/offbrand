#!/bin/bash
cd ../src/microservices/auth-service/scripts

./deploy.sh

cd ../../order-management-service/scripts

./deploy.sh

cd ../../product-management-service/scripts 

./deploy.sh

#TODO Implement the file xd