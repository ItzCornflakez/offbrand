import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  console.log("Priunt")
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Swagger Options
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Offbrand - User-Management-Service API')
    .setDescription('Endpoints for the offbrand product management service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`/docs`, app, document);

  console.log('APP listening on PORT ', port);
  await app.listen(port);
}
bootstrap();