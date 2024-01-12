import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      noAck: false,
      urls: [`amqp://user:password@rabbitmq:5672`],
      ...app.get(ConfigService).get('rabbitmqCredentials'),
      queue: 'verify-token-queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.startAllMicroservices();

  const configService = app.get(ConfigService);
  const port = configService.get('AUTH_APP_PORT');
  await app.listen(port);
}
bootstrap();
