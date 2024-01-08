import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DiscountService {
  constructor(private prismaService: PrismaService) {}

  //Endpoint functions
  async getAllActiveDiscounts() {}

  async getDiscountById(discountId: number) {
    console.log(discountId);
  }

  //RabbitMQ functions
  async createDiscount() {}

  async updateDicsount() {}

  async activateDiscount() {}

  async inactivateDiscount() {}

  async deleteDiscount() {}

  async restoreDiscount() {}
}
