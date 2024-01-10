import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { toBoolean } from '../../common/utils/cast.helpers';

export class EditDiscountDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  desc?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  discount_percent?: number;

  @ApiProperty({ required: false })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({ required: false })
  @IsISO8601()
  @IsOptional()
  start_date?: string;

  @ApiProperty({ required: false })
  @IsISO8601()
  @IsOptional()
  end_date?: string;
}
