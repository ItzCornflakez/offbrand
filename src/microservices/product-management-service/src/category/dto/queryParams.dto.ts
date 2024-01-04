import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';
import { toBoolean } from '../../common/utils/cast.helpers';


export class GetAllCategoriesQueryParamsDto {
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  show_deleted?: boolean;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  limit?: number;
}


export class GetAllDeletedCategoriesQueryParamsDto{
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number;
}