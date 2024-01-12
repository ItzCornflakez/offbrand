import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  total_price: number;
}
