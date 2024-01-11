import { IsString } from 'class-validator';

export class CreateProductVariantDto {
  @IsString()
  color?: string;
}
