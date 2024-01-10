import { IsOptional, IsString } from 'class-validator';

export class EditProductVariantDto {
  @IsString()
  @IsOptional()
  color?: string;
}
