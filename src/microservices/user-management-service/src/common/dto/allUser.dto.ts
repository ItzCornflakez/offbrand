import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AllUserDto {

    //User dto
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    role: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    last_name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone_number: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address_1: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address_2: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    postal_code: string;

    //Password dto

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

}