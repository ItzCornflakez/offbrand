import { NestFactory } from '@nestjs/core';
import { ReviewModule } from './review/review.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('RMS_APP_PORT');

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Offbrand - Review-Management-Service API')
    .setDescription('Endpoints for the offbrand review management service')
    .setVersion('1.0')
    .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`/docs`, app, document);
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      noAck: false,
      urls: [`amqp://user:password@rabbitmq:5672`],
      ...configService.get('rabbitmqCredentials'),
      queue: 'pms-rms-product-queue',
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
      ...configService.get('rabbitmqCredentials'),
      queue: 'ums-rms-user-queue',
      queueOptions: {
        durable: false,
      },
    },
  });


  await app.startAllMicroservices();
  
  await app.listen(port);
}
bootstrap();
