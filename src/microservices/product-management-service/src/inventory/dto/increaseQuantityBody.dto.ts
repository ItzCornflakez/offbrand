import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class IncreaseQuantityBodyDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity: number;
}
