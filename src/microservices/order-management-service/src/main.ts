import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { HttpExceptionFilter } from './common/exception-filters/httpException.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      noAck: false,
      urls: [`amqp://user:password@rabbitmq:5672`],
      ...app.get(ConfigService).get('rabbitmqCredentials'),
      queue: 'pms-oms-product-queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      noAck: false,
      urls: [`amqp://user:password@rabbitmq:5672`],
      ...app.get(ConfigService).get('rabbitmqCredentials'),
      queue: 'user-queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  
  await app.startAllMicroservices();

  app.useGlobalFilters(new HttpExceptionFilter(new Logger()));

  app.enableVersioning({
    type: VersioningType.URI
  })

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Offbrand - Order-Management-Service API')
    .setDescription('Endpoints for the offbrand order management service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`/docs`, app, document);


  const configService = app.get(ConfigService);
  const port = configService.get('OMS_APP_PORT');
  await app.listen(port);
}
bootstrap();
