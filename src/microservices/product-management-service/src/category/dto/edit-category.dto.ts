import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditCategoryDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  desc?: string;
}
