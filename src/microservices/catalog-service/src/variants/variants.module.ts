import { Module } from '@nestjs/common';
import { VariantService } from './variants.service';
import { VariantController } from './variants.constroller';

@Module({
  controllers: [VariantController],
  providers: [VariantService],
})
export class VariantModule {}
