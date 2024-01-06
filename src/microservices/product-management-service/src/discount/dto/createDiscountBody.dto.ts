import { Transform } from 'class-transformer';
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
import { toBoolean } from 'src/common/utils/cast.helpers';

export class CreateNewDiscountDto {
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

  @Transform(({ value }) => toBoolean(value))
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
