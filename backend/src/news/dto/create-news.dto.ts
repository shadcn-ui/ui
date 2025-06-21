import { IsString, Length } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @Length(3, 120)
  title: string;

  @IsString()
  @Length(10, 3000)
  content: string;
}
