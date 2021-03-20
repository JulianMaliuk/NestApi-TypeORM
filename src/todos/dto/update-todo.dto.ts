import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  text?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  done?: boolean;
}
