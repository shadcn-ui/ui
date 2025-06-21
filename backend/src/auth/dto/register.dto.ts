import { Department } from '../../enums/user.enums';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsPhoneNumber,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
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

  @IsEnum(Department, {
    message: 'department должен быть одним из значений Department ENUM',
  })
  department: Department;

  @IsOptional()
  @IsString()
  floor?: string;

  @IsOptional()
  @IsString()
  cabinet?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  equipmentId?: number;
}
