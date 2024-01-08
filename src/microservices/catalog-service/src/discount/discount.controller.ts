import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Version,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscountService } from './discount.service';
import { DefaultResponseDto } from 'src/common/dto/defaultResponse.dto';

@Controller('discounts')
@ApiTags('Discount')
export class DiscountController {
  constructor(private discountService: DiscountService) {}

  @Get()
  @Version('1')
  async getAllActiveDiscounts(): Promise<DefaultResponseDto> {
    //const { discounts, totalEntries } =
    //  await this.discountService.getAllActiveDiscounts();

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'All active discounts retrived successfully.',
      //data: {
      //  categories: discounts,
      //  totalEntries: totalEntries,
      //},
    };

    return response;
  }

  @Get(':id')
  @Version('1')
  async getDiscountById(
    @Param('id', ParseIntPipe) discountId: number,
  ): Promise<DefaultResponseDto> {
    const discount = await this.discountService.getDiscountById(discountId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `discount: '${discountId}' retrived successfully`,
      data: discount,
    };

    return response;
  }
}
