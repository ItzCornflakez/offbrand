import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProductModule } from './product/product.module';
import { InventoryModule } from './inventory/inventory.module';
import { categoryModule } from './category/category.module';
import { DiscountModule } from './discount/discount.module';

import {
  validateTestEnvFile,
  validateProductionEnvFile,
} from '../config/environment.validation';

//Validate the env file
let validateFunction;
switch (process.env.NODE_ENV) {
  case 'production':
    validateFunction = validateProductionEnvFile;
    break;
  case 'test':
    validateFunction = validateTestEnvFile;
    break;
  default:
    throw new Error(
      `Unsupported or missing NODE_ENV: ${process.env.NODE_ENV}. Please set NODE_ENV to either 'production' or 'test' in the environment file.`,
    );
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateFunction,
    }), //Load configuration file
    ProductModule,
    InventoryModule,
    categoryModule,
    DiscountModule,
  ],
})
export class AppModule {}
