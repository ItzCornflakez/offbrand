import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class EditOrderDto {
  @ApiProperty()
  @IsNumber()
  @Optional()
  total_price?: number;

  @ApiProperty()
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
