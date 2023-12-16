import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';

@Module({
  controllers: [CatalogController],
  imports: [],
  providers: [],
})
export class CatalogModule {}
