import { IsString, IsOptional, IsDateString, IsPhoneNumber, IsEnum } from 'class-validator';
import { Department, Role } from '../../enums/user.enums';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  snils?: string;

  @IsOptional()
  @IsPhoneNumber('RU')
  mobilePhone?: string;

  @IsOptional()
  @IsString()
  internalPhone?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsEnum(Department)
  department?: Department;

  @IsOptional()
  @IsString()
  floor?: string;

  @IsOptional()
  @IsString()
  cabinet?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  // ДОБАВЛЕНО: пароль (опционально, только при необходимости смены)
  @IsOptional()
  @IsString()
  password?: string;
}
