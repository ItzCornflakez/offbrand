import { IsNotEmpty, IsString, IsNumber, IsArray, ArrayMinSize, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class CreateInventoryBodyDto {
  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateProductBodyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  category_id: number;

  @IsOptional()
  @IsNumber()
  discount_id: number;

  @IsString()
  @IsNotEmpty()
  desc: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  picture: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateInventoryBodyDto)
  inventories: CreateInventoryBodyDto[];
}
