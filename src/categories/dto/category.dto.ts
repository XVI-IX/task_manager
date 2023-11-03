import { IsInt, IsString } from "class-validator";

export class CategoryDto {

  @IsString()
  categoryName: string;

  @IsInt()
  user_id?: number;
}