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
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateDiscountDto } from './dto/createDiscount.dto';
import { EditDiscountDto } from './dto/editDiscount.dto';

@Controller('discounts')
@ApiTags('Discount')
export class DiscountController {
  constructor(private discountService: DiscountService) {}

  @Get()
  @Version('1')
  async getAllDiscounts(): Promise<DefaultResponseDto> {
    const discounts = await this.discountService.getAllDiscounts();

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'All discounts retrived successfully.',
      data: discounts,
    };

    return response;
  }

  @Get('/active')
  @Version('1')
  async getAllActiveDiscounts(): Promise<DefaultResponseDto> {
    const discounts = await this.discountService.getAllActiveDiscounts();

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'All active discounts retrived successfully.',
      data: discounts,
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

  @MessagePattern({ cmd: 'create-discount' })
  async createDiscount(
    @Payload() createDiscountDto: CreateDiscountDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.discountService.createDiscount(createDiscountDto);

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'update-discount' })
  async updateDicsount(
    @Payload()
    payload: { discountId: number; editDiscountDto: EditDiscountDto },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.discountService.updateDicsount(
      payload.discountId,
      payload.editDiscountDto,
    );

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'activate-discount' })
  async activateDiscount(
    @Payload() discountId: number,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.discountService.activateDiscount(discountId);

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'inactivate-discount' })
  async inactivateDiscount(
    @Payload() discountId: number,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.discountService.inactivateDiscount(discountId);

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'delete-discount' })
  async deleteDiscount(
    @Payload() discountId: number,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.discountService.deleteDiscount(discountId);

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'restore-discount' })
  async restoreDiscount(
    @Payload() discountId: number,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.discountService.restoreDiscount(discountId);

    channel.ack(originalMsg);
  }
}
