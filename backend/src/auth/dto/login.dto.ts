import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  snils: string;

  @IsString()
  password: string;
}
