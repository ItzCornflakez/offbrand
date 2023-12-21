import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProductModule } from './product/product.module';
import { InventoryModule } from './inventory/inventory.module';
import { categoryModule } from './category/category.module';
import { DiscountModule } from './discount/discount.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), //Load configuration file
    ProductModule,
    InventoryModule,
    categoryModule,
    DiscountModule,
  ],
})
export class AppModule {}
