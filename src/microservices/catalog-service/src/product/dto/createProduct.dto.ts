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

export class CreateProductVariantDto {
  @IsOptional()
  @IsString()
  color: string;
}

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  category_id: number;

  @IsOptional()
  @IsNumber()
  discount_id?: number;

  @IsString()
  @IsNotEmpty()
  desc: string;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  picture: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants: CreateProductVariantDto[];
}
