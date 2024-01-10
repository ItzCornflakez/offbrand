import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import {
  validateTestEnvFile,
  validateProductionEnvFile,
} from '../config/environment.validation';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { categoryModule } from './category/category.module';
import { DiscountModule } from './discount/discount.module';
import { VariantModule } from './variants/variants.module';

//Validate the env file
let validateFunction;
switch (process.env.CATALOG_NODE_ENV) {
  case 'production':
    validateFunction = validateProductionEnvFile;
    break;
  case 'test':
    validateFunction = validateTestEnvFile;
    break;
  default:
    throw new Error(
      `Unsupported or missing NODE_ENV: ${process.env.CATALOG_NODE_ENV}. Please set NODE_ENV to either 'production' or 'test' in the environment file.`,
    );
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateFunction,
    }), //Load configuration file
    PrismaModule,
    ProductModule,
    categoryModule,
    DiscountModule,
    VariantModule,
  ],
})
export class AppModule {}
