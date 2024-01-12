<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

A comprehensive microservices project of a ecommerce site backend using [Nest](https://github.com/nestjs/nest), RabbitMQ, Prisma and docker.

### Implementation
The following picture shows a simple overview over how the different microservices talks to each other with the help
of RabbitMQ.

![alt text](docs/offbrand-overview-schema.PNG)

The system supports the following three roles:
 - **admin**
 - **worker**
 - **user**

Here is an small summarization of each microservice. 

 - **Product-management-service**: Handles everything related with product handling such as creating and handling  products, creating and handling inventories as well as creating and handling discounts and categories. Only an admin can utuilize these endpoints.   

 - **Autentication-service**: Handles the authentication and authorization of users. Any microservice that is utilizing authentication and authorization completes these checks by communicating with this service through RabbitMQ.     

  - **Catalog-service**: Replicates the state of the product-management and is used to retrive the availible products on the site. No authorization or authentication is needed to reach these endpoints.  

  - **Order-management-service**: Handles everything that is related to handling orders. The endpoint one can access is dependant on ones role. The order-management-service uses rabbitMQ when creating an order to see if there is enough products in stock to "make the purchase" i.e creating a valid order.    

  - **User-management-service**: Handles everything related to user management such as the creation and deletion of users. The endpoint one can access here is dependent on the role. Once a new user has been created it notifies the order-management-service and the review-service that a new user has been created.      

  - **Review-service**: Handles everything related to creating, retriving, updating and deleting reviews.    

## Prerequisites

- Docker installed on your local machine. You can follow Docker's tutorial for [macOS](https://docs.docker.com/desktop/install/mac-install/) or [Windows](https://docs.docker.com/desktop/install/windows-install/).
 - The Docker-Compose plugin installed on your machine. You can find download instructions [here](https://docs.docker.com/compose/install/).


## Running the app

```bash
cd script
./deploy.sh
```

## Test

As of now there is no extensive testing due to time constraints, but it is setup to implement. 

## License

Nest is [MIT licensed](LICENSE).
