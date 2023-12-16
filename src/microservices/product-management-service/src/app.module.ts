import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProductModule } from './product/product.module';
import { InventoryModule } from './inventory/inventory.module';
import { categoryModule } from './category/category.module';
import { DiscountModule } from './discount/discount.module';

import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
    }), //Load configuration file based on NODE_ENV
    ProductModule,
    InventoryModule,
    categoryModule,
    DiscountModule,
  ],
})
export class AppModule {}
