import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "User's username"
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "User's password",
    example: "392090293ei"
  })
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: "User's email",
    example: "test@mail.com"
  })
  email: string;
}