import { Module } from '@nestjs/common';
import { VariantService } from './variants.service';

@Module({
  providers: [VariantService],
})
export class VariantModule {}
