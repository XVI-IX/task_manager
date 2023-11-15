import { IsString, IsNotEmpty, IsDate, IsInt } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Task's title",
    example: "Huckleberry Finn"
  })
  title: string;


  @IsString()
  @ApiProperty({
    description: "Task's description",
    example: "Huckleberry's adventures"
  })
  description: string;

  @IsString()
  @ApiProperty({
    description: "Task's due date",
    example: "2020-10-20"
  })
  due_date: string;

  @IsInt()
  @ApiProperty({
    description: "Priority assigned to task",
    example: 1
  })
  priority: number;

  @IsInt()
  @ApiProperty({
    description: "Identifier of categoru this task is classified under",
    example: 1
  })
  category_id: number;

  @ApiProperty({
    description: "Unique Identifier of task creator",
    example: 1
  })
  user_id?: number;
}