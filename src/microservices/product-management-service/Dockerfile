# Stage 1: Build for development
FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Set environment variables for development
ENV NODE_ENV=development

#RUN npx prisma generate  --schema=src/prisma/schema.prisma
#RUN sleep 10
RUN npx prisma migrate dev --name init --schema=src/prisma/schema.prisma

CMD ["npm", "run", "start:dev" ]

# Stage 2: Build for production
FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

# Set environment variables for production
ENV NODE_ENV=production

CMD ["npm", "run", "start:prod"]