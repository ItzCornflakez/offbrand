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


  await app.startAllMicroservices();
  
  await app.listen(port);
}
bootstrap();
