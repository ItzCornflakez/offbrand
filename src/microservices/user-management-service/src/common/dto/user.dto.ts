import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    role: string;   
}