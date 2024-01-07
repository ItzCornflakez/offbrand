import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class EditInventoryBodyDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  color?: string;
}
