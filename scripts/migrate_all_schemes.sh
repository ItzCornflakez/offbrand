#!/bin/bash

cd ../src/microservices/order-management-service/scripts

./migrate_schema.sh

cd ../../product-management-service/scripts 

./migrate_schema.sh

cd ../../user-management-service/scripts 

./migrate_schema.sh

#TODO Implement the file xd