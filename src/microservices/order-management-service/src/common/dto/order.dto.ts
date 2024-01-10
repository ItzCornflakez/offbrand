import { ApiProperty } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";


export class OrderDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    user_id: number;
    
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    total_price: number;

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