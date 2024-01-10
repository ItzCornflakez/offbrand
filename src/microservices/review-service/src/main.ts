import { NestFactory } from '@nestjs/core';
import { ReviewModule } from './review/review.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ReviewModule);

  const configService = app.get(ConfigService);
  const port = configService.get('RMS_APP_PORT');
  await app.listen(port);
}
bootstrap();
