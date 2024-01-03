import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "User's username",
    example: 'Oxdd',
    type: String,
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "User's password",
    example: '392090293ei',
    type: String,
  })
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: "User's email",
    example: 'test@mail.com',
    type: String,
  })
  email: string;
}
