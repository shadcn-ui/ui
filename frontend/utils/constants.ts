export const PRIORITY_LABELS: Record<'LOW' | 'NORMAL' | 'HIGH' | 'URGENT', string> = {
    LOW: 'Низкий',
    NORMAL: 'Обычный',
    HIGH: 'Высокий',
    URGENT: 'Срочный',
  };
  
  export const STATUS_LABELS: Record<'NEW' | 'IN_PROGRESS' | 'COMPLETED', string> = {
    NEW: 'Новая',
    IN_PROGRESS: 'В работе',
    COMPLETED: 'Завершена',
  };
  
  export const SOURCE_LABELS: Record<'WEB' | 'TELEGRAM' | 'PHONE', string> = {
    WEB: 'Портал',
    TELEGRAM: 'Телеграм',
    PHONE: 'По телефону',
  };
  