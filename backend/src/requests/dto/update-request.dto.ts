import {
  IsOptional,
  IsString,
  MaxLength,
  IsEnum,
  IsInt,
  IsDateString,
  Min,
  Max,
  IsArray,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

// Обновлённый enum с поддержкой всех статусов из БД/фронта
export enum RequestStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  RESOLVED = 'RESOLVED',
  DONE = 'DONE',
}

export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export class UpdateRequestDto {
  @IsOptional()
  @IsString({ message: 'Заголовок должен быть строкой' })
  @MaxLength(100, { message: 'Максимальная длина заголовка — 100 символов' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  content?: string;

  @IsOptional()
  @IsEnum(RequestStatus, { message: 'Недопустимый статус заявки' })
  status?: RequestStatus;

  @IsOptional()
  @IsEnum(Priority, { message: 'Недопустимый приоритет' })
  priority?: Priority;

  /**
   * Категория — nullable. Пустая строка всегда превращается в null.
   */
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined) return undefined;
    if (value === null) return null;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed === '' ? null : trimmed;
    }
    return undefined;
  })
  @ValidateIf((o) => o.category !== undefined)
  @IsString({ message: 'Категория должна быть строкой' })
  category?: string | null;

  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null || value === '' ? undefined : Number(value)
  )
  @IsInt({ message: 'ID исполнителя должен быть числом' })
  @Min(1, { message: 'Минимальный ID исполнителя — 1' })
  executorId?: number;

  @IsOptional()
  @IsDateString({}, { message: 'Ожидаемая дата должна быть в формате ISO' })
  expectedResolutionDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Дата закрытия должна быть в формате ISO' })
  resolvedAt?: string;

  // --- Валидация рейтинга только для статусов DONE и COMPLETED ---
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null || value === '' ? undefined : Number(value)
  )
  @ValidateIf((o) => o.status === 'DONE' || o.status === 'COMPLETED')
  @IsInt({ message: 'Оценка должна быть числом от 1 до 5' })
  @Min(1, { message: 'Минимальная оценка — 1' })
  @Max(5, { message: 'Максимальная оценка — 5' })
  rating?: number;

  @IsOptional()
  @ValidateIf((o) => o.status === 'DONE' || o.status === 'COMPLETED')
  @IsString({ message: 'Отзыв должен быть строкой' })
  feedback?: string;

  /**
   * fileUrls теперь всегда массив строк.
   * - Если массив — фильтрует и приводит каждый элемент к строке, убирает пустые.
   * - Если строка — возвращает массив из одного непустого элемента.
   * - Иначе возвращает пустой массив.
   */
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) {
      return undefined;
    }
    if (Array.isArray(value)) {
      return value
        .filter((v) => typeof v === 'string')
        .map((v) => v.trim())
        .filter((v) => v !== '');
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed ? [trimmed] : [];
    }
    return [];
  })
  @ValidateIf((o) => o.fileUrls !== undefined)
  @IsArray({ message: 'fileUrls должен быть массивом строк' })
  @IsString({ each: true, message: 'Каждый файл должен быть строкой (URL)' })
  fileUrls?: string[];
}
