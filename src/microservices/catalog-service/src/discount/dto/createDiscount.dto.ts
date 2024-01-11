import {
  IsBoolean,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  desc: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(1)
  discount_percent: number;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsISO8601()
  @IsOptional()
  start_date?: string;

  @IsISO8601()
  @IsOptional()
  end_date?: string;
}
