import { IsString, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class EditProductBodyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  category_id?: number;

  @IsOptional()
  @IsNumber()
  discount_id?: number;

  @IsString()
  @IsOptional()
  desc?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsString()
  picture?: string;
}
