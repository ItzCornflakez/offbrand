import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  //Clean the database (used for testing)
  async cleanDb() {
    await this.$transaction([
      this.discount.deleteMany(),
      this.inventory.deleteMany(),
      this.productCategory.deleteMany(),
      this.category.deleteMany(),
      this.product.deleteMany(),
    ]);
  }
}
