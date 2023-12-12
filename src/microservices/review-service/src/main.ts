import { NestFactory } from '@nestjs/core';
import { ReviewModule } from './review.module';

async function bootstrap() {
  const app = await NestFactory.create(ReviewModule);
  await app.listen(3000);
}
bootstrap();
