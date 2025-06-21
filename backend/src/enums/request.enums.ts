export enum RequestStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  REJECTED = 'REJECTED',
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
