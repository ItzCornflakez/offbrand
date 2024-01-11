import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class EditOrderItemDto {

    @ApiProperty()
    @IsNumber()
    @Optional()
    quantity?: number;

    @ApiProperty()
    @IsString()
    @Optional()
    color?: string;

    @ApiProperty()
    @IsNumber()
    @Optional()
    price?: number;
}