import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class DefaultResponseDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  statusText: string;

  @IsOptional()
  data?: any;
}
