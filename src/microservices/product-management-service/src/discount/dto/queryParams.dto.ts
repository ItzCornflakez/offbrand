import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';
import { toBoolean } from '../../common/utils/cast.helpers';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllDiscountsQueryParamsDto {
  @ApiProperty({ required: false, default: true })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  show_deleted?: boolean;

  @ApiProperty({ required: false, default: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false, default: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  limit?: number;
}

export class GetDiscountsQueryParamsDto {
  @ApiProperty({ required: false, default: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, default: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number;
}
