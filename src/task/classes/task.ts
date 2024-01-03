import { ApiProperty } from '@nestjs/swagger';

export class Task {
  @ApiProperty({
    example: 1,
  })
  task_id: number;

  @ApiProperty({
    example: 'Task title',
  })
  title: string;

  @ApiProperty({
    example: 'task description',
  })
  description: string;

  @ApiProperty({
    example: Number,
  })
  priority: number;

  @ApiProperty({
    example: 1,
  })
  user_id: number;

  @ApiProperty({
    example: 2,
  })
  category_id: number;

  @ApiProperty({
    example: '2021-10-02',
  })
  created_at: string;

  @ApiProperty({
    example: '2023-10-20',
  })
  updated_at: string;
}
