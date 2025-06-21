import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateNewsDto {
  @IsOptional()
  @IsString()
  @Length(3, 120)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(10, 3000)
  content?: string;
}
