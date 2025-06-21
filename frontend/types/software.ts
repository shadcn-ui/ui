import { User } from './user';
import { Equipment } from './equipment';

// Используется при создании/редактировании формы
export interface SoftwareFormData {
  name: string;
  version?: string;
  licenseKey?: string;
  licensedTo?: string;
  adminLogin?: string;
  adminPassword?: string;
  networkAddress?: string;
  installLocation?: string;        // ✅ добавлено
  floor?: string;
  cabinet?: string;
  purchaseDate?: string;
  supportStart?: string;
  supportEnd?: string;
  expiryDate?: string;
  assignedUserId?: number;
  assignedEquipmentId?: number;
  equipmentIds?: number[];         // ✅ добавлено
  fileUrls?: File[];               // Для формы — загружаемые файлы
}

// Используется для отображения, чтения с сервера, карточек и таблиц
export interface SoftwareDetails {
  id: number;
  name: string;
  version?: string;
  licenseKey?: string;
  licensedTo?: string;
  adminLogin?: string;
  adminPassword?: string;
  networkAddress?: string;
  installLocation?: string;
  purchaseDate?: string;
  supportStart?: string;
  supportEnd?: string;
  expiryDate?: string;
  assignedUserId?: number;
  equipmentIds?: number[];
  fileUrls?: string[]; // ⚠️ получаемые с сервера ссылки
  users?: User[];
  equipment?: Equipment[];
}
