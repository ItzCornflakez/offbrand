import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common';
import { DiscountService } from './discount.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateNewDiscountDto } from './dto/createDiscountBody.dto';
import { DefaultResponseDto } from 'src/common/dto/defaultResponse.dto';
import { EditDiscountDto } from './dto/editDiscountBody.dto';
import {
  GetAllDiscountsQueryParamsDto,
  GetDiscountsQueryParamsDto,
} from './dto/queryParams.dto';
import { Roles } from 'src/common/utils/decorators/roles.decorators';
import { AuthGuard } from 'src/common/utils/guards/auth.guard';
import { RoleGuard } from 'src/common/utils/guards/roles.guard';

@Controller('discounts')
@Roles('admin')
@UseGuards(AuthGuard, RoleGuard)
@ApiTags('Discount')
export class DiscountController {
  constructor(private discountService: DiscountService) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create a discount' })
  async createNewDiscount(
    @Body() createDiscountDto: CreateNewDiscountDto,
  ): Promise<DefaultResponseDto> {
    const newDiscount =
      await this.discountService.createNewDiscount(createDiscountDto);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.CREATED,
      statusText: 'Disscount created successfully.',
      data: newDiscount,
    };

    return response;
  }

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Get all discounts' })
  async getAllDiscounts(
    @Query() getAllDiscountsQueryParamsDto: GetAllDiscountsQueryParamsDto,
  ): Promise<DefaultResponseDto> {
    const { discounts, totalEntries } =
      await this.discountService.getAllDiscounts(getAllDiscountsQueryParamsDto);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Discount(s) retrived successfully.',
      data: {
        discounts: discounts,
        totalEntries: totalEntries,
      },
    };

    return response;
  }

  @Get('/active')
  @Version('1')
  @ApiOperation({ summary: 'Get all active discounts' })
  async getAllActiveDiscounts(
    @Query() getDiscountQueryParamsDto: GetDiscountsQueryParamsDto,
  ): Promise<DefaultResponseDto> {
    const { activeDiscounts, totalEntries } =
      await this.discountService.getAllActiveDiscounts(
        getDiscountQueryParamsDto,
      );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Disscount(s) retrived successfully.',
      data: {
        discounts: activeDiscounts,
        totalEntries: totalEntries,
      },
    };

    return response;
  }

  @Get('/inactive')
  @Version('1')
  @ApiOperation({ summary: 'Get all inactive discounts' })
  async getAllInactiveDiscounts(
    @Query() getDiscountQueryParamsDto: GetDiscountsQueryParamsDto,
  ) {
    const { inactiveDiscounts, totalEntries } =
      await this.discountService.getAllInactiveDiscounts(
        getDiscountQueryParamsDto,
      );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Disscount(s) retrived successfully.',
      data: {
        discounts: inactiveDiscounts,
        totalEntries: totalEntries,
      },
    };

    return response;
  }

  @Get('/deleted')
  @Version('1')
  @ApiOperation({ summary: 'Get all deleted discounts' })
  async getAllDeletedDiscounts(
    @Query() getDiscountQueryParamsDto: GetDiscountsQueryParamsDto,
  ): Promise<DefaultResponseDto> {
    const { deletedDisounts, totalEntries } =
      await this.discountService.getAllDeletedDiscounts(
        getDiscountQueryParamsDto,
      );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Disscount(s) retrived successfully.',
      data: {
        discounts: deletedDisounts,
        totalEntries: totalEntries,
      },
    };

    return response;
  }

  @Get(':id')
  @Version('1')
  @ApiOperation({ summary: `Get a discount by it's id` })
  async getDiscountById(
    @Param('id', ParseIntPipe) discountId: number,
  ): Promise<DefaultResponseDto> {
    const discount = await this.discountService.getDiscountById(discountId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Disscount retrived successfully.',
      data: discount,
    };

    return response;
  }

  @Put(':id')
  @Version('1')
  @ApiOperation({ summary: `Update a discounts by it's id` })
  async updateDiscountById(
    @Param('id', ParseIntPipe) discountId: number,
    @Body() editDiscountDto: EditDiscountDto,
  ): Promise<DefaultResponseDto> {
    const updatedDiscount = await this.discountService.updateDiscountById(
      discountId,
      editDiscountDto,
    );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Discount: '${discountId}' was updated successfully.`,
      data: updatedDiscount,
    };

    return response;
  }

  @Patch(':id/delete')
  @Version('1')
  @ApiOperation({ summary: `Delete a discount by it's id` })
  async deleteDiscountById(
    @Param('id', ParseIntPipe) discountId: number,
  ): Promise<DefaultResponseDto> {
    await this.discountService.deleteDiscountById(discountId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Discount: '${discountId}' was deleted successfully.`,
    };

    return response;
  }

  @Patch(':id/restore')
  @Version('1')
  @ApiOperation({ summary: `Restore a discount by it's id` })
  async restoreDiscountById(
    @Param('id', ParseIntPipe) discountId: number,
  ): Promise<DefaultResponseDto> {
    await this.discountService.restoreDiscountById(discountId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Discount: '${discountId}' was restored successfully.`,
    };

    return response;
  }

  @Patch(':id/activate')
  @Version('1')
  @ApiOperation({ summary: `Activate a discount by it's id` })
  async activateDiscountById(
    @Param('id', ParseIntPipe) discountId: number,
  ): Promise<DefaultResponseDto> {
    const activatedDiscount =
      await this.discountService.activateDiscountById(discountId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Discount '${discountId}' was activated successfully.`,
      data: activatedDiscount,
    };

    return response;
  }

  @Patch(':id/inactivate')
  @Version('1')
  @ApiOperation({ summary: `Inactivate a discount by it's id` })
  async inactivateDiscountById(
    @Param('id', ParseIntPipe) discountId: number,
  ): Promise<DefaultResponseDto> {
    const inactivatedDiscount =
      await this.discountService.inactivateDiscountById(discountId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Discount: '${discountId}' was inactivated successfully.`,
      data: inactivatedDiscount,
    };

    return response;
  }
}
