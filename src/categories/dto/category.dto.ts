import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @IsString()
  @ApiProperty({
    description: 'Category name as specified by user',
    example: 'Workout',
    type: String,
  })
  categoryName: string;

  @ApiProperty({
    description: 'user id of user creating category',
    example: '29',
    type: Number,
  })
  user_id?: number;
}
