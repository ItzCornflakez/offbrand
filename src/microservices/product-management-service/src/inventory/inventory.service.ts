import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  GetAllInventoriesQueryParamsDto,
  GetInventoriesQueryParamsDto,
} from './dto/queryParams.dto';
import { EditInventoryBodyDto } from './dto/editInventoryBody.dto';
import { Prisma } from '@prisma/client';
import { ReduceQuantityBodyDto } from './dto/reduceQuantityBody.dto';
import { IncreaseQuantityBodyDto } from './dto/increaseQuantityBody.dto';

@Injectable()
export class InventoryService {
  constructor(private prismaService: PrismaService) {}

  async getAllInventories(
    getAllInventoriesQueryParamsDto: GetAllInventoriesQueryParamsDto,
  ) {
    //Default to default value if the query param is undefined
    const show_deleted = getAllInventoriesQueryParamsDto.show_deleted ?? true;
    const page = getAllInventoriesQueryParamsDto.page ?? 1;
    const limit = getAllInventoriesQueryParamsDto.limit ?? 0;

    const skip = (page - 1) * limit;

    try {
      const inventories = await this.prismaService.inventory.findMany({
        where: show_deleted ? {} : { is_deleted: false },
        skip,
        take: limit === 0 ? undefined : limit,
        include: {
          product: {
            select: {
              name: true,
              is_deleted: true,
            },
          },
        },
      });

      const totalEntries = await this.prismaService.inventory.count({
        where: show_deleted ? {} : { is_deleted: false },
      });

      return { inventories, totalEntries };
    } catch (e) {
      throw new InternalServerErrorException(
        'Something went wrong retriving the inventories, please try again later.',
        { cause: e },
      );
    }
  }

  async getInventoryById(inventoryId: number) {
    try {
      const inventory = await this.prismaService.inventory.findUnique({
        where: { id: inventoryId },
        include: {
          product: {
            select: {
              name: true,
              is_deleted: true,
            },
          },
        },
      });

      if (!inventory) {
        throw new NotFoundException(
          `Cannot retrive the inventory with ID '${inventoryId}' because it does not exist.`,
        );
      }

      return inventory;
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to retrieve inventory with ID: '${inventoryId}'. Please try again later.`,
        { cause: e },
      );
    }
  }

  async getAllDeletedInventories(
    getInventoriesQueryParamsDto: GetInventoriesQueryParamsDto,
  ) {
    //Default to default value if the query param is undefined
    const page = getInventoriesQueryParamsDto.page ?? 1;
    const limit = getInventoriesQueryParamsDto.limit ?? 0;

    const skip = (page - 1) * limit;

    try {
      const inventories = await this.prismaService.inventory.findMany({
        where: { is_deleted: true },
        skip,
        take: limit === 0 ? undefined : limit,
        include: {
          product: {
            select: {
              name: true,
              is_deleted: true,
            },
          },
        },
      });

      const totalEntries = await this.prismaService.inventory.count({
        where: { is_deleted: true },
      });

      return { inventories, totalEntries };
    } catch (e) {
      throw new InternalServerErrorException(
        'Something went wrong retriving all of the deleted inventories, please try again later.',
        { cause: e },
      );
    }
  }

  async updateInventoryById(
    inventoryId: number,
    editInventoryBodyDto: EditInventoryBodyDto,
  ) {
    try {
      const inventory = await this.prismaService.inventory.findUnique({
        where: { id: inventoryId },
      });

      if (!inventory) {
        throw new NotFoundException(
          `Cannot perform the operation on the inventory with ID '${inventoryId}' because it does not exist.`,
        );
      }

      const updatedInventory = await this.prismaService.$transaction([
        this.prismaService.inventory.update({
          where: { id: inventoryId },
          data: { ...editInventoryBodyDto, last_updated_at: new Date() },
          include: {
            product: {
              select: {
                name: true,
                is_deleted: true,
              },
            },
          },
        }),
      ]);

      return updatedInventory;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException(
            `Cannot perform the operation on the inventory with ID '${inventoryId}' because the same color is already associated with this product.`,
            { cause: e },
          );
        } else {
          throw new InternalServerErrorException(
            `Something went wrong updating the inventory with ID '${inventoryId}', please try again later.`,
            { cause: e },
          );
        }
      } else {
        throw new InternalServerErrorException(
          `Something went wrong updating the inventory with ID '${inventoryId}', please try again later.`,
          { cause: e },
        );
      }
    }
  }

  async deleteInventoryById(inventoryId: number) {
    try {
      const inventory = await this.prismaService.inventory.findUnique({
        where: { id: inventoryId },
      });

      if (!inventory) {
        throw new NotFoundException(
          `Cannot perform the operation on the inventory with ID '${inventoryId}' because it does not exist.`,
        );
      }

      if (inventory.is_deleted) {
        throw new ConflictException(
          `Cannot perform the operation on the inventory with ID '${inventoryId}' because it is already marked as deleted.`,
        );
      }

      const nonDeletedInventoriesCount =
        await this.prismaService.inventory.count({
          where: {
            product_id: inventory.product_id,
            is_deleted: false,
          },
        });

      //If this is the last non deleted inventory, throw an conflictException
      if (nonDeletedInventoriesCount === 1) {
        throw new ConflictException(
          `Cannot delete inventory with ID '${inventoryId}' because it is the last non-deleted inventory for product with ID ${inventory.product_id}.`,
        );
      }

      await this.prismaService.$transaction([
        this.prismaService.inventory.update({
          where: { id: inventoryId },
          data: { is_deleted: true, last_updated_at: new Date() },
        }),
      ]);
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ConflictException) {
        throw e;
      }

      throw new InternalServerErrorException(
        `Could not delete inventory with ID: '${inventoryId}', please try again later.`,
        { cause: e },
      );
    }
  }

  async restoreInventoryById(inventoryId: number) {
    try {
      const inventory = await this.prismaService.inventory.findUnique({
        where: { id: inventoryId },
      });

      if (!inventory) {
        throw new NotFoundException(
          `Cannot perform the operation on the inventory with ID '${inventoryId}' because it does not exist.`,
        );
      }

      if (!inventory.is_deleted) {
        throw new ConflictException(
          `Cannot perform the operation on the inventory with ID '${inventoryId}' because it is not marked as deleted.`,
        );
      }

      // Retrieve related product
      const product = await this.prismaService.product.findUnique({
        where: { id: inventory.product_id },
      });

      // Check if related product is deleted
      if (product.is_deleted) {
        throw new ConflictException(
          `Cannot perform the operation because the product with ID: '${product.id}' is deleted! Restore it first.`,
        );
      }

      await this.prismaService.$transaction([
        this.prismaService.inventory.update({
          where: { id: inventoryId },
          data: { is_deleted: false, last_updated_at: new Date() },
        }),
      ]);
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ConflictException) {
        throw e;
      }

      throw new InternalServerErrorException(
        `Could not delete inventory with ID: '${inventoryId}', please try again later.`,
        { cause: e },
      );
    }
  }

  async reduceInventoryById(
    inventoryId: number,
    reduceQuantityBodyDto: ReduceQuantityBodyDto,
  ) {
    const inventory = await this.prismaService.inventory.findUnique({
      where: { id: inventoryId },
    });

    if (!inventory) {
      throw new NotFoundException(
        `Cannot perform the operation on the inventory with ID '${inventoryId}' because it does not exist.`,
      );
    }

    if (inventory.is_deleted) {
      throw new ConflictException(
        `Cannot perform the operation on the inventory with ID '${inventoryId}' because it is marked as deleted.`,
      );
    }

    const newInventoryQuantity =
      inventory.quantity - reduceQuantityBodyDto.quantity;
    if (newInventoryQuantity < 0) {
      throw new ConflictException(
        `Cannot perform the operation on the inventory with ID '${inventoryId}' due to insufficient quantity. `,
      );
    }

    const reducedInventory = await this.prismaService.$transaction([
      this.prismaService.inventory.update({
        where: { id: inventoryId },
        data: { quantity: newInventoryQuantity, last_updated_at: new Date() },
      }),
    ]);

    return reducedInventory;
  }

  async increaseInventoryById(
    inventoryId: number,
    increaseQuantityBodyDto: IncreaseQuantityBodyDto,
  ) {
    const inventory = await this.prismaService.inventory.findUnique({
      where: { id: inventoryId },
    });

    if (!inventory) {
      throw new NotFoundException(
        `Cannot perform the operation on the inventory with ID '${inventoryId}' because it does not exist.`,
      );
    }

    if (inventory.is_deleted) {
      throw new ConflictException(
        `Cannot perform the operation on the inventory with ID '${inventoryId}' because it is marked as deleted.`,
      );
    }

    const newInventoryQuantity =
      inventory.quantity + increaseQuantityBodyDto.quantity;

    const increasedInventory = await this.prismaService.$transaction([
      this.prismaService.inventory.update({
        where: { id: inventoryId },
        data: { quantity: newInventoryQuantity, last_updated_at: new Date() },
      }),
    ]);

    return increasedInventory;
  }
}
