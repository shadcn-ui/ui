import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from '../../enums/user.enums';

// ✅ Используй этот ENUM NotificationType ВЕЗДЕ в проекте!
export enum NotificationType {
  REQUEST = 'request',
  NEWS = 'news',
  SYSTEM = 'system',
  USER = 'user',
  EQUIPMENT = 'equipment',
  SOFTWARE = 'software',
}

export class CreateNotificationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  department?: string; // строкой, если департамент ENUM — замени на @IsEnum(Department)

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsOptional()
  @IsString()
  url?: string;
}
