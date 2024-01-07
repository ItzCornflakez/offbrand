import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class IncreaseQuantityBodyDto {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity: number;
}
