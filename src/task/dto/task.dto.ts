import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Task's title",
    example: 'Huckleberry Finn',
    type: String,
  })
  title: string;

  @IsString()
  @ApiProperty({
    description: "Task's description",
    example: "Huckleberry's adventures",
    type: String,
  })
  description: string;

  @IsString()
  @ApiProperty({
    description: "Task's due date",
    example: '2020-10-20',
    type: String,
  })
  due_date: string;

  @IsInt()
  @ApiProperty({
    description: 'Priority assigned to task',
    example: 1,
    type: Number,
  })
  priority: number;

  @IsInt()
  @ApiProperty({
    description: 'Identifier of category this task is classified under',
    example: 1,
    type: Number,
  })
  category_id: number;

  @ApiProperty({
    description: 'Unique Identifier of task creator',
    example: 1,
    type: Number,
  })
  user_id?: number;
}
