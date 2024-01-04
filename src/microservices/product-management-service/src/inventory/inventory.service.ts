import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetAllInventoriesQueryParamsDto, GetInventoriesQueryParamsDto } from './dto/queryParams.dto';
import { EditInventoryBodyDto } from './dto/editInventoryBody.dto';
import { Prisma } from '@prisma/client';


@Injectable()
export class InventoryService {
    constructor(private prismaService: PrismaService){}

    async getAllInventories(getAllInventoriesQueryParamsDto: GetAllInventoriesQueryParamsDto){
        //Default to default value if the query param is undefined
        const show_deleted = getAllInventoriesQueryParamsDto.show_deleted ?? true;
        const page = getAllInventoriesQueryParamsDto.page ?? 1;
        const limit = getAllInventoriesQueryParamsDto.limit ?? 0;

        const skip = (page - 1) * limit;

        try{
            const inventories = this.prismaService.inventory.findMany({
                where: show_deleted ? {} : { is_deleted: false },
                skip,
                take: limit === 0 ? undefined : limit,
                select: {
                    id: true,
                    quantity: true,
                    color: true,
                    is_deleted: true,
                    created_at: true,
                    last_updated_at: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            const totalEntries = await this.prismaService.inventory.count({
                where: show_deleted ? {} : { is_deleted: false },
            });

            return {inventories, totalEntries};
        }catch(e){
            throw new InternalServerErrorException("Something went wrong retriving the inventories, please try again later", { cause: e })
        }
    }

    async getInventoryById(inventoryId: number){
        try{
            const inventory = await this.prismaService.inventory.findUnique({
                where: {id: inventoryId},
                select: {
                    id: true,
                    quantity: true,
                    color: true,
                    is_deleted: true,
                    created_at: true,
                    last_updated_at: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
    
            if(!inventory){
                throw new NotFoundException(`The inventory with id: ${inventoryId} does not exist`);
            }
    
            return inventory;
        }catch(e){
            throw new InternalServerErrorException(`Failed to retrieve inventory with id: '${inventoryId}'. Please try again later.`, { cause: e });
        }
    }

    async getAllDeletedInventories(getInventoriesQueryParamsDto: GetInventoriesQueryParamsDto){
        //Default to default value if the query param is undefined
        const page = getInventoriesQueryParamsDto.page ?? 1;
        const limit = getInventoriesQueryParamsDto.limit ?? 0;

        const skip = (page - 1) * limit;

        try{
            const inventories = await this.prismaService.inventory.findMany({
                where: {is_deleted: true},
                skip,
                take: limit === 0 ? undefined : limit,
                select: {
                    id: true,
                    quantity: true,
                    color: true,
                    is_deleted: true,
                    created_at: true,
                    last_updated_at: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            const totalEntries = await this.prismaService.inventory.count(
                {where: {is_deleted: true}
            });

            return {inventories, totalEntries};
        }catch(e){
            throw new InternalServerErrorException('Something went wrong retriving all of the deleted inventories, please try again later', { cause: e });
        }
    }

    async updateInventoryById(inventoryId: number, editInventoryBodyDto: EditInventoryBodyDto){
        try{
            const updatedInventory = await this.prismaService.inventory.update({
                where: {id: inventoryId},
                data: {...editInventoryBodyDto, last_updated_at: new Date()},
                select: {
                    id: true,
                    quantity: true,
                    color: true,
                    is_deleted: true,
                    created_at: true,
                    last_updated_at: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            return updatedInventory;
        }catch(e){
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new ConflictException(`Same Color Error (update error message later)`, { cause: e });
                } else {
                    throw new InternalServerErrorException("Something went wrong updating , please try again later", { cause: e });
                }
            } else {
                throw new InternalServerErrorException("Something went wrong updating the new product, please try again later", { cause: e });
            }
        }
    }

    async deleteInventoryById(inventoryId: number){
        try{
            const inventory = await this.prismaService.inventory.findUnique({
                where: {id: inventoryId},
            });

            if(!inventory){
                throw new NotFoundException(`The inventory with id: '${inventoryId}' does not exist`);
            }

            if(inventory.is_deleted){
                throw new ConflictException(`The inventory with id: '${inventoryId}' is already deleted`);
            }

            const nonDeletedInventoriesCount = await this.prismaService.inventory.count({
                where: {
                    productId: inventory.productId,
                    is_deleted: false,
                },
            });

            //If this is the last non deleted inventory, throw an conflictException
            if (nonDeletedInventoriesCount === 1) {
                throw new ConflictException(`The inventory with id: '${inventoryId}' is already deleted`);
            }
            
            await this.prismaService.$transaction(
              [
                this.prismaService.inventory.update({
                  where: {id: inventoryId},
                  data: {is_deleted: true, last_updated_at: new Date()},
                })
              ]
            );
        }catch(e){
            throw new InternalServerErrorException("", {cause: e});
        }
    }

    async restoreInventoryById(inventoryId: number){
        try{
            const inventory = await this.prismaService.inventory.findUnique({
                where: {id: inventoryId},
            });

            if(!inventory){
                throw new NotFoundException(`The inventory with id: '${inventoryId}' does not exist`);
            }

            if(!inventory.is_deleted){
                throw new ConflictException(`The inventory with id: '${inventoryId}' is not deleted`);
            }

            await this.prismaService.$transaction(
                [
                  this.prismaService.inventory.update({
                    where: {id: inventoryId},
                    data: {is_deleted: false, last_updated_at: new Date()},
                  })
                ]
            );
        }catch(e){
            throw new InternalServerErrorException("", {cause: e});
        }
    }
}
