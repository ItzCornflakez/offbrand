import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class ReduceQuantityBodyDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity: number;
}
