import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReviewDto {
  //User dto
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  score: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  dislikes: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  likes: number;
}
