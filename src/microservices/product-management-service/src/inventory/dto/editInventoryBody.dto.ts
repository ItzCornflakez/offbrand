import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class EditInventoryBodyDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsString()
  color?: string;
}
