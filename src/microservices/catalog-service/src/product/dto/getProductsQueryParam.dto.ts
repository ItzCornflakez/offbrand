import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsEnum } from 'class-validator';

export enum SortBy {
  RECENT_FIRST = 'RECENT_FIRST',
  OLDEST_FIRST = 'OLDEST_FIRST',
  LOWEST_PRICE = 'LOWEST_PRICE',
  HIGHEST_PRICE = 'HIGHEST_PRICE',
}

export class GetProductsQueryParamsDto {
  @ApiProperty({ required: false, default: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false, default: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    enum: SortBy,
    default: SortBy.RECENT_FIRST,
  })
  @IsEnum(SortBy)
  @IsOptional()
  sort_by?: SortBy;
}
