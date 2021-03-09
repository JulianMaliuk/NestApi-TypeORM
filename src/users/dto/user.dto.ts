import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  username: string;

  @IsArray()
  roles: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
