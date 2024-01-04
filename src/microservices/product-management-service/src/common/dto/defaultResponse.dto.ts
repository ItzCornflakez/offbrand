import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class DefaultResponseDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  statusCode: number;

  @IsString()
  @IsNotEmpty()
  statusText: string;

  @IsOptional()
  data?: any;
}
