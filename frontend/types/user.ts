export type UserRole = 'USER' | 'ADMIN' | 'SUPERADMIN';

export interface User {
  id: number;
  lastName: string;
  firstName: string;
  middleName?: string;
  department: string;
  position: string;
  role: UserRole;
  internalPhone: string;
  mobilePhone: string;   // ✅ добавлено
  floor?: string;        // ✅ добавлено
  cabinet?: string;      // ✅ добавлено
  fullName?: string;
}

export interface AssignedEquipment {
  id: number;
  name: string;
  type: string;
  inventoryNumber: string;
}

export interface AssignedSoftware {
  id: number;
  name: string;
  version?: string;
}

export interface UserDetails extends User {
  birthDate: string;
  snils: string;
  assignedEquipment?: AssignedEquipment[];
  software?: AssignedSoftware[];
}
