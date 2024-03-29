import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ReviewModule } from './review/review.module';

import {
  validateTestEnvFile,
  validateProductionEnvFile,
} from '../config/environment.validation';
import { PrismaModule } from './prisma/prisma.module';

//Validate the env file
let validateFunction;
switch (process.env.RMS_NODE_ENV) {
  case 'production':
    validateFunction = validateProductionEnvFile;
    break;
  case 'test':
    validateFunction = validateTestEnvFile;
    break;
  default:
    throw new Error(
      `Unsupported or missing NODE_ENV: ${process.env.RMS_NODE_ENV}. Please set NODE_ENV to either 'production' or 'test' in the environment file.`,
    );
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateFunction,
    }), //Load configuration file
    ReviewModule,
    PrismaModule,
  ],
})
export class AppModule {}
