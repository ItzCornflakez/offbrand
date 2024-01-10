import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductVariantDto } from './dto/createProductVariant.dto';
import { EditProductVariantDto } from './dto/editProductVariant.dto';

@Injectable()
export class VariantService {
  constructor(private prismaService: PrismaService) {}

  async createNewProductVariant(
    productId: number,
    createVariantDto: CreateProductVariantDto,
  ) {
    try {
      await this.prismaService.product.update({
        where: { id: productId },
        data: {
          variants: {
            create: createVariantDto,
          },
        },
      });
    } catch (e) {
      return e;
    }
  }

  async updateVariant(
    variantId: number,
    editVariantDto: EditProductVariantDto,
  ) {
    try {
      await this.prismaService.variants.update({
        where: { id: variantId },
        data: { ...editVariantDto, last_updated_at: new Date() },
      });
    } catch (e) {
      return e;
    }
  }

  async deleteVariant(variantId: number) {
    try {
      this.prismaService.variants.update({
        where: { id: variantId },
        data: { is_deleted: true, last_updated_at: new Date() },
      });
    } catch (e) {
      return e;
    }
  }

  async restoreVariant(variantId: number) {
    try {
      this.prismaService.variants.update({
        where: { id: variantId },
        data: { is_deleted: false, last_updated_at: new Date() },
      });
    } catch (e) {
      return e;
    }
  }

  async toggleSoldOutById() {}
}
