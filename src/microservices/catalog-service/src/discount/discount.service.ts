import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiscountDto } from './dto/createDiscount.dto';
import { EditDiscountDto } from './dto/editDiscount.dto';

@Injectable()
export class DiscountService {
  constructor(private prismaService: PrismaService) {}

  //Endpoint functions
  async getAllDiscounts() {
    try {
      const discounts = await this.prismaService.discount.findMany({
        where: { is_deleted: false },
      });

      return discounts;
    } catch (e) {
      throw new InternalServerErrorException('Could not fetch all discounts', {
        cause: e,
      });
    }
  }

  async getAllActiveDiscounts() {
    try {
      const discounts = await this.prismaService.discount.findMany({
        where: { is_deleted: false, is_active: true },
      });

      return discounts;
    } catch (e) {
      throw new InternalServerErrorException(
        'Could not fetch all active discounts',
        { cause: e },
      );
    }
  }

  async getDiscountById(discountId: number) {
    try {
      const discount = await this.prismaService.discount.findUnique({
        where: { id: discountId },
      });

      if (!discount) {
        throw new NotFoundException(
          `Could not find disocunt with ID: '${discountId}' because it does not exist`,
        );
      }

      return discount;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }

      throw new InternalServerErrorException(
        `Could not fetch discount with ID: '${discountId}`,
        { cause: e },
      );
    }
  }

  //RabbitMQ functions
  async createDiscount(createDiscountDto: CreateDiscountDto) {
    try {
      await this.prismaService.discount.create({
        data: { ...createDiscountDto },
      });
    } catch (e) {
      return e;
    }
  }

  async updateDicsount(discountId: number, editDiscountDto: EditDiscountDto) {
    try {
      await this.prismaService.discount.update({
        where: { id: discountId },
        data: { ...editDiscountDto, last_updated_at: new Date() },
      });
    } catch (e) {
      return e;
    }
  }

  async activateDiscount(discountId: number) {
    try {
      await this.prismaService.discount.update({
        where: { id: discountId },
        data: { is_active: true, last_updated_at: new Date() },
      });
    } catch (e) {
      return e;
    }
  }

  async inactivateDiscount(discountId: number) {
    try {
      await this.prismaService.discount.update({
        where: { id: discountId },
        data: { is_active: false, last_updated_at: new Date() },
      });
    } catch (e) {
      return e;
    }
  }

  async deleteDiscount(discountId: number) {
    try {
      await this.prismaService.discount.update({
        where: { id: discountId },
        data: { is_deleted: true, last_updated_at: new Date() },
      });
    } catch (e) {
      return e;
    }
  }

  async restoreDiscount(discountId: number) {
    try {
      await this.prismaService.discount.update({
        where: { id: discountId },
        data: { is_deleted: false, last_updated_at: new Date() },
      });
    } catch (e) {
      return e;
    }
  }
}
