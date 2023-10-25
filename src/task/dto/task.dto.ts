import { IsString, IsNotEmpty, IsDate, IsInt } from "class-validator";

export class TaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  due_date: string;

  @IsInt()
  priority: number;

  @IsInt()
  category_id: number;

  user_id?: number;
}