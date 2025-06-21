// frontend/types/types.ts

export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type RequestStatus = 'NEW' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export interface RequestComment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export interface Executor {
  firstName: string;
  lastName: string;
  middleName?: string;
  internalPhone?: string;
}

export interface Request {
  id: number;
  title: string;
  content: string;
  status: RequestStatus;
  priority?: Priority;
  category?: string;
  createdAt: string;
  resolvedAt?: string | null;
  expectedResolutionDate?: string | null;
  feedback?: string | null;
  rating?: number | null;
  fileUrls?: string[];
  executor?: Executor | null;
  comments: RequestComment[];
}
