#!/bin/bash
#!/bin/bash
cd ../src/microservices/auth-service/scripts

./deploy.sh system-prod

cd ../../catalog-service/scripts

./deploy.sh system-prod

cd ../../order-management-service/scripts

./deploy.sh system-prod

cd ../../product-management-service/scripts

./deploy.sh system-prod

cd ../../review-service/scripts

./deploy.sh system-prod

cd ../../user-management-service/scripts

./deploy.sh system-prod

cd ../../../../

COMPOSE_HTTP_TIMEOUT=2500 docker-compose up -d

docker-compose ps





