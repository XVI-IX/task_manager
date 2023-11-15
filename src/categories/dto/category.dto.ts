import { IsInt, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {

  @IsString()
  @ApiProperty({
    description: "Category name as specified by user",
    example: "Workout"
  })
  categoryName: string;

  @ApiProperty({
    description: "user id of user creating category",
    example: "29"
  })
  user_id?: number;
}