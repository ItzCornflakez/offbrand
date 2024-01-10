import { ApiProperty } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class OrderItemDto {

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    order_id: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    product_id: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    color: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty()
    @IsEnum(Status)
    @IsOptional()
    status? : Status;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    created_at?: Date;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    updated_at?: Date;

}