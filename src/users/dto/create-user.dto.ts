import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class UserCreateDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  readonly name?: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  readonly username: string;

  @IsString()
  @ApiProperty()
  readonly password: string;
}
