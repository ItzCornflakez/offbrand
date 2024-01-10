import { Controller } from '@nestjs/common';
import { VariantService } from './variants.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateProductVariantDto } from './dto/createProductVariant.dto';
import { EditProductVariantDto } from './dto/editProductVariant.dto';

@Controller()
export class VariantController {
  constructor(private variantService: VariantService) {}

  @MessagePattern({ cmd: 'create-variant' })
  async createNewProductVariant(
    @Payload()
    payload: { productId: number; createVariantDto: CreateProductVariantDto },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.variantService.createNewProductVariant(
      payload.productId,
      payload.createVariantDto,
    );

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'update-variant' })
  async updateVariant(
    @Payload()
    payload: { variantId: number; editVariantDto: EditProductVariantDto },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.variantService.updateVariant(
      payload.variantId,
      payload.editVariantDto,
    );

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'delete-variant' })
  async toggleSoldOutById(
    @Payload() variantId: number,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.variantService.deleteVariant(variantId);

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'restore-variant' })
  async deleteVariant(
    @Payload() variantId: number,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.variantService.restoreVariant(variantId);

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'toggle-sold_out-variant' })
  async restoreVariant(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    console.log('Handling delete-productmessage');

    channel.ack(originalMsg);
  }
}
