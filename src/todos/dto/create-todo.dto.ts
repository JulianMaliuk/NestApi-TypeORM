import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @ApiProperty()
  text: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  done?: boolean;
}
