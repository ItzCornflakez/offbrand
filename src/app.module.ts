import { Module } from '@nestjs/common';
import { AuthModule } from './microservices/authenticate-service/auth.module';
import { CatalogModule } from './microservices/catalog-service/catalog.module';
import { OrderModule } from './microservices/order-management-service/order.module';
import { ProductModule } from './microservices/product-management-service/product.module';
import { ReviewModule } from './microservices/review-service/review.module';
import { UserModule } from './microservices/user-management-service/user.module';

@Module({
  imports: [AuthModule, CatalogModule, OrderModule, ProductModule, ReviewModule, UserModule]
})
export class AppModule {}
