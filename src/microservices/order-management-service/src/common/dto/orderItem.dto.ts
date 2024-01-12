import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderItemDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  order_id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
