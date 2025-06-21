import { Role, Department } from '../enums/user.enums';
// Импорт NotificationType строго из DTO!
import { NotificationType } from './dto/create-notification.dto';

/**
 * Payload для создания нового уведомления.
 */
export interface NotificationPayload {
  /** ID пользователя-получателя (если персонально) */
  userId?: number;

  /** Роль получателя (если для роли) */
  role?: Role;

  /** Департамент получателя (только enum Department) */
  department?: Department;

  /** Заголовок уведомления */
  title: string;

  /** Основной текст уведомления */
  message: string;

  /** Тип уведомления (строго enum NotificationType) */
  type: NotificationType;

  /** URL-ссылка, на которую ведёт уведомление (относительная или абсолютная) */
  url?: string;
}

/**
 * Структура уведомления, передаваемого клиенту через WebSocket или API.
 */
export interface NotificationMessage {
  /** Уникальный идентификатор уведомления */
  id?: string;

  /** Заголовок */
  title: string;

  /** Основной текст */
  message: string;

  /** Тип уведомления (enum NotificationType) */
  type: NotificationType;

  /** Ссылка (если есть) */
  url?: string;

  /** Дата создания уведомления */
  createdAt?: Date;

  /** Признак прочтения */
  isRead?: boolean;
}
