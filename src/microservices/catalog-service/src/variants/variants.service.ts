import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VariantService {
  constructor(private prismaService: PrismaService) {}

  async createNewProductVariant() {}

  async updateVariant() {}

  async toggleSoldOutById() {}

  async deleteVariant() {}

  async restoreVariant() {}
}
