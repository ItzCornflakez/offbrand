# Stage 1: Build Stage
FROM node:18-alpine AS build

# Create workdir for NestJS project
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm install

# Install bash
RUN apk --no-cache add bash

# Copy NestJS project to the Docker container
COPY . .

# Generate prisma file
RUN npx prisma generate

# Build the project
RUN npm run build

# Stage 2: Production Stage
FROM node:18-alpine AS production

# Create workdir for NestJS project in production image
WORKDIR /usr/src/app

# Copy only necessary files from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/package-lock.json .

# Expose the application port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Command to run the application in production
CMD ["npm", "run", "start:migrate:prod"]

# Stage 3: Development Stage
FROM node:18-alpine AS development

# Create workdir for NestJS project in development image
WORKDIR /usr/src/app

# Copy all files from the build stage
COPY --from=build /usr/src/app .

# Expose the application port
EXPOSE 3000

# Set environment to development
ENV NODE_ENV=development

# Command to run the application in production
CMD ["npm", "run", "start:dev"]

