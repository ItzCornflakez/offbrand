import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OrderModule } from './order/order.module';


import {
  validateTestEnvFile,
  validateProductionEnvFile,
} from '../config/environment.validation';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderItemModule } from './orderItem/orderItem.module';

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
    OrderModule,
    OrderItemModule
  ],
  
})
export class AppModule {}
