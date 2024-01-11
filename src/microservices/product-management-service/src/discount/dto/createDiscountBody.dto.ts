import { ApiProperty } from '@nestjs/swagger';

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

export class CreateNewDiscountDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  desc: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(1)
  discount_percent: number;

  @ApiProperty({ required: false, nullable: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({ required: false, nullable: true })
  @IsISO8601()
  @IsOptional()
  start_date?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsISO8601()
  @IsOptional()
  end_date?: string;
}
