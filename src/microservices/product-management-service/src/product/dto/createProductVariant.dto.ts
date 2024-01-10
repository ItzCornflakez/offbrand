import { IsString } from 'class-validator';

export class CreateProductVariantBodyDto {
  @IsString()
  color: string;
}
