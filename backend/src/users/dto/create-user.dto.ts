import { IsString, IsOptional, IsDateString, IsPhoneNumber, IsEnum, MinLength } from 'class-validator';
import { Department, Role } from '../../enums/user.enums';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsDateString()
  birthDate: string;

  @IsString()
  snils: string;

  @IsPhoneNumber('RU')
  mobilePhone: string;

  @IsString()
  internalPhone: string;

  @IsString()
  position: string;

  @IsEnum(Department)
  department: Department;

  @IsOptional()
  @IsString()
  floor?: string;

  @IsOptional()
  @IsString()
  cabinet?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
