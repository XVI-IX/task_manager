import { IsInt, IsString } from "class-validator";

export class CategoryDto {

  @IsString()
  categoryName: string;

  user_id?: number;
}