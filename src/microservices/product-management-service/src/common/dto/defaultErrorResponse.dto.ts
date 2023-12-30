import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class DefaultErrorResponseDto {
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
  errors?: any;
}
