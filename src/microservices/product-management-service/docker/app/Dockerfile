# Stage 1: Build Stage
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

# Install bash
RUN apk --no-cache add bash

COPY . .

# Generate prisma file
RUN npx prisma generate

# Build the project
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /usr/src/app

#Copy all files from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/package-lock.json .
COPY --from=build /usr/src/app/prisma .

CMD ["npm", "run", "start:migrate:prod"]

FROM node:18-alpine AS development

WORKDIR /usr/src/app

# Copy all files from the build stage
COPY --from=build /usr/src/app .

CMD ["npm", "run", "start:dev"]