#!/bin/bash
#cd ../src/microservices/order-management-service/scripts

#./deploy_rabbitmq.sh

cd ../src/microservices/order-management-service/scripts

./deploy.sh

cd ../../product-management-service/scripts 

./deploy.sh

#TODO Implement the file xd