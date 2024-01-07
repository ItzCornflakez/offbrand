import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryBodyDto {
  @ApiProperty({ required: false, uniqueItems: true})
  @IsOptional()
  @IsString()
  color: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  quantity: number;
}

export class CreateProductBodyDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  category_id: number;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsNumber()
  discount_id?: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  desc: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  price: number;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  picture: string;

  @ApiProperty({ required: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateInventoryBodyDto)
  inventories: CreateInventoryBodyDto[];
}
