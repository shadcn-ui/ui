import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEnum,
  IsOptional,
  IsDateString,
  IsInt,
  IsArray,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum RequestStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum RequestSource {
  WEB = 'WEB',
  TELEGRAM = 'TELEGRAM',
  PHONE = 'PHONE',
}

export class CreateRequestDto {
  @IsNotEmpty({ message: 'Заголовок не должен быть пустым' })
  @IsString({ message: 'Заголовок должен быть строкой' })
  @MaxLength(100, { message: 'Максимальная длина заголовка — 100 символов' })
  title: string;

  @IsNotEmpty({ message: 'Описание не должно быть пустым' })
  @IsString({ message: 'Описание должно быть строкой' })
  content: string;

  @IsOptional()
  @IsEnum(RequestStatus, { message: 'Недопустимый статус заявки' })
  status?: RequestStatus;

  @IsOptional()
  @IsEnum(Priority, { message: 'Недопустимый приоритет' })
  priority?: Priority;

  @IsOptional()
  @IsString({ message: 'Категория должна быть строкой' })
  @MaxLength(50, { message: 'Максимальная длина категории — 50 символов' })
  category?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ожидаемая дата должна быть в формате ISO' })
  expectedResolutionDate?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null || value === '' ? undefined : Number(value)
  )
  @IsInt({ message: 'ID исполнителя должен быть числом' })
  @Min(1, { message: 'Минимальный ID исполнителя — 1' })
  executorId?: number;

  @IsOptional()
  @Transform(({ value }) => Array.isArray(value) ? value : value ? [value] : [])
  @IsArray({ message: 'fileUrls должен быть массивом строк (URL)' })
  @IsString({ each: true, message: 'Каждая ссылка должна быть строкой (URL)' })
  fileUrls?: string[];

  @IsOptional()
  @IsEnum(RequestSource, { message: 'Недопустимый источник заявки' })
  source?: RequestSource;
}
