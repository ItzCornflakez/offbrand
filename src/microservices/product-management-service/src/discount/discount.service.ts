import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewDiscountDto } from './dto/createDiscountBody.dto';
import { EditDiscountDto } from './dto/editDiscountBody.dto';
import {
  GetAllDiscountsQueryParamsDto,
  GetDiscountsQueryParamsDto,
} from './dto/queryParams.dto';

@Injectable()
export class DiscountService {
  constructor(private prismaService: PrismaService) {}

  async createNewDiscount(newDiscountDto: CreateNewDiscountDto) {
    try {
      const newDiscount = this.prismaService.discount.create({
        data: { ...newDiscountDto },
      });
      return newDiscount;
    } catch (e) {
      throw new InternalServerErrorException(
        'Something went wrong creating the new discount, please try again later.',
        { cause: e },
      );
    }
  }

  async getAllDiscounts(
    getAllDiscountsQueryParamsDto: GetAllDiscountsQueryParamsDto,
  ) {
    //Default to default value if the query param is undefined
    const show_deleted = getAllDiscountsQueryParamsDto.show_deleted ?? true;
    const page = getAllDiscountsQueryParamsDto.page ?? 1;
    const limit = getAllDiscountsQueryParamsDto.limit ?? 0;

    const skip = (page - 1) * limit;

    try {
      const discounts = this.prismaService.discount.findMany({
        where: show_deleted ? {} : { is_deleted: false },
        skip,
        take: limit === 0 ? undefined : limit,
      });

      const totalEntries = await this.prismaService.category.count({
        where: show_deleted ? {} : { is_deleted: false },
      });

      return { discounts, totalEntries };
    } catch (e) {
      throw new InternalServerErrorException(
        'Something went wrong retriving the discounts, please try again later.',
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
          `Cannot retrive discount with ID:'${discountId}' because it does not exist.`,
        );
      }

      return discount;
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to retrieve discount with id: '${discountId}'. Please try again later.`,
        { cause: e },
      );
    }
  }

  async getAllActiveDiscounts(
    getDiscountQueryParamsDto: GetDiscountsQueryParamsDto,
  ) {
    //Default to default value if the query param is undefined
    const page = getDiscountQueryParamsDto.page ?? 1;
    const limit = getDiscountQueryParamsDto.limit ?? 0;

    const skip = (page - 1) * limit;

    try {
      const activeDiscounts = await this.prismaService.discount.findMany({
        where: { is_active: true },
        skip,
        take: limit === 0 ? undefined : limit,
      });

      const totalEntries = await this.prismaService.discount.count({
        where: { is_active: true },
      });

      return { activeDiscounts, totalEntries };
    } catch (e) {
      throw new InternalServerErrorException(
        'Something went wrong retriving all of the active discounts, please try again later.',
        { cause: e },
      );
    }
  }

  async getAllInactiveDiscounts(
    getDiscountQueryParamsDto: GetDiscountsQueryParamsDto,
  ) {
    //Default to default value if the query param is undefined
    const page = getDiscountQueryParamsDto.page ?? 1;
    const limit = getDiscountQueryParamsDto.limit ?? 0;

    const skip = (page - 1) * limit;

    try {
      const inactiveDiscounts = await this.prismaService.discount.findMany({
        where: { is_active: false },
        skip,
        take: limit === 0 ? undefined : limit,
      });

      const totalEntries = await this.prismaService.discount.count({
        where: { is_active: false },
      });

      return { inactiveDiscounts, totalEntries };
    } catch (e) {
      throw new InternalServerErrorException(
        'Something went wrong retriving all of the inactive discounts, please try again later.',
        { cause: e },
      );
    }
  }

  async getAllDeletedDiscounts(
    getDiscountQueryParamsDto: GetDiscountsQueryParamsDto,
  ) {
    //Default to default value if the query param is undefined
    const page = getDiscountQueryParamsDto.page ?? 1;
    const limit = getDiscountQueryParamsDto.limit ?? 0;

    const skip = (page - 1) * limit;

    try {
      const deletedDisounts = await this.prismaService.discount.findMany({
        where: { is_deleted: true },
        skip,
        take: limit === 0 ? undefined : limit,
      });

      const totalEntries = await this.prismaService.discount.count({
        where: { is_deleted: true },
      });

      return { deletedDisounts, totalEntries };
    } catch (e) {
      throw new InternalServerErrorException(
        'Something went wrong retriving all of the deleted discounts, please try again later.',
        { cause: e },
      );
    }
  }

  async updateDiscountById(
    discountId: number,
    editDiscountDto: EditDiscountDto,
  ) {
    try {
      const discount = await this.prismaService.discount.findUnique({
        where: { id: discountId },
      });

      if (!discount) {
        throw new NotFoundException(
          `Cannot perform the operation on the discount with ID '${discountId}' because it does not exist.`,
        );
      }

      if (discount.is_deleted) {
        throw new ConflictException(
          `Cannot perform the operation on the discount with ID '${discountId}' because it is marked as deleted.`,
        );
      }

      const updatedDiscount = await this.prismaService.discount.update({
        where: { id: discountId },
        data: { ...editDiscountDto, last_updated_at: new Date() },
      });
      return updatedDiscount;
    } catch (e) {
      throw new InternalServerErrorException(
        `Something went wrong updating discount: '${discountId}', please try again later. `,
        { cause: e },
      );
    }
  }

  async deleteDiscountById(discountId: number) {
    try {
      const discount = await this.prismaService.discount.findUnique({
        where: { id: discountId },
      });

      if (!discount) {
        throw new NotFoundException(
          `Cannot perform the operation on the discount with ID '${discountId}' because it does not exist.`,
        );
      }

      if (discount.is_deleted) {
        throw new ConflictException(
          `Cannot perform the operation on the discount with ID '${discountId}' because it is already marked as deleted.`,
        );
      }

      await this.prismaService.discount.update({
        where: { id: discountId },
        data: { is_deleted: true, last_updated_at: new Date() },
      });
    } catch (e) {
      throw new InternalServerErrorException(
        `Something went wrong deleting discount: '${discountId}', please try again later. `,
        { cause: e },
      );
    }
  }

  async restoreDiscountById(discountId: number) {
    try {
      const discount = await this.prismaService.discount.findUnique({
        where: { id: discountId },
      });

      if (!discount) {
        throw new NotFoundException(
          `Cannot perform the operation on the discount with ID '${discountId}' because it does not exist.`,
        );
      }

      if (!discount.is_deleted) {
        throw new ConflictException(
          `Cannot perform the operation on the discount with ID '${discountId}' because it is not marked as deleted.`,
        );
      }

      await this.prismaService.discount.update({
        where: { id: discountId },
        data: { is_deleted: true, last_updated_at: new Date() },
      });
    } catch (e) {
      throw new InternalServerErrorException(
        `Something went wrong restoring discount: '${discountId}', please try again later.`,
        { cause: e },
      );
    }
  }

  async activateDiscountById(discountId: number) {
    try {
      const discount = await this.prismaService.discount.findUnique({
        where: { id: discountId },
      });

      if (!discount) {
        throw new NotFoundException(
          `Cannot activate discount with ID: '${discountId}' because it does not exist.`,
        );
      }

      if (discount.is_active) {
        throw new ConflictException(
          `Cannot activate discount with ID: '${discountId}' because it is already active.`,
        );
      }

      const activatedDiscount = await this.prismaService.discount.update({
        where: { id: discountId },
        data: { is_active: true, last_updated_at: new Date() },
      });

      return activatedDiscount;
    } catch (e) {
      throw new InternalServerErrorException(
        `Something went wrong activating discount: '${discountId}', please try again later.`,
        { cause: e },
      );
    }
  }

  async inactivateDiscountById(discountId: number) {
    try {
      const discount = await this.prismaService.discount.findUnique({
        where: { id: discountId },
      });

      if (!discount) {
        throw new NotFoundException(
          `Cannot inactivate discount with ID: '${discountId}' because it does not exist.`,
        );
      }

      if (!discount.is_active) {
        throw new ConflictException(
          `Cannot activate discount with ID: '${discountId}' because it is already inactive.`,
        );
      }

      const inactivatedDiscount = await this.prismaService.discount.update({
        where: { id: discountId },
        data: { is_active: false, last_updated_at: new Date() },
      });

      return inactivatedDiscount;
    } catch (e) {
      throw new InternalServerErrorException(
        `Something went wrong inactivating discount: '${discountId}', please try again later.`,
        { cause: e },
      );
    }
  }
}
