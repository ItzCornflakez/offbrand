import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exception-filters/httpException.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter(new Logger()));
  const configService = app.get(ConfigService);
  const port = configService.get<number>('CATALOG_APP_PORT');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Swagger Options
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Offbrand - Catalog-Service API')
    .setDescription('Endpoints for the offbrand product management service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`/docs`, app, document);

  const rabbitmqEnabled = configService.get<boolean>('PMS_RABBITMQ_ENABLED');
  if (rabbitmqEnabled) {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        noAck: false,
        urls: [`amqp://user:password@rabbitmq:5672`],
        ...configService.get('rabbitmqCredentials'),
        queue: 'pms-catalog-product-queue',
        queueOptions: {
          durable: false,
        },
      },
    });
    await app.startAllMicroservices();
  }

  await app.listen(port);
}
bootstrap();
