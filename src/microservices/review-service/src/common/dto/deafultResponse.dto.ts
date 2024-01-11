import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class DefaultResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  statusCode: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  statusText: string;

  @ApiProperty()
  @IsOptional()
  data?: any;
}