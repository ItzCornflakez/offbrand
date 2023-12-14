FROM node:18-alpine

#Create workdir for NestJS project
WORKDIR /usr/src/app

COPY package.json package-lock.json ./

#Install the Project package
RUN npm install

#Copy NestJS project to docker container
COPY . .

#Generate prisma file
RUN npx prisma generate

#Build the project
RUN npm run build

#Change env to production
ENV NODE_ENV production

#Expose project port
EXPOSE 3000

#Start the NestJS project
CMD ["npm", "run", "start:migrate:prod"]