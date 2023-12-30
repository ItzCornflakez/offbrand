import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(dto: CreateCategoryDto) {
    const createdCategory = await this.prisma.category.create({
      data: {
        ...dto,
      },
    });

    return createdCategory;
  }

  getAllCategories() {
    return this.prisma.category.findMany();
  }
}
