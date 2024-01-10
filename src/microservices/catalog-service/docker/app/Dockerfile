FROM node:18-alpine

#Create workdir for NestJS project
WORKDIR /usr/src/app

COPY package.json package-lock.json ./

#Install the Project package
RUN npm install

# Install bash
RUN apk --no-cache add bash

#Copy NestJS project to docker container
COPY . .

# Install Prisma client
RUN npm install @prisma/client

#Generate prisma file
RUN npx prisma generate

#Build the project
RUN npm run build

