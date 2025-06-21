import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role, Department } from '../enums/user.enums';
import { Equipment } from './equipment.entity';
import { Request } from './request.entity';
import { Comment } from './comment.entity';
import { Notification } from './notification.entity';
import { Software } from './software.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100, nullable: true })
  middleName?: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: Role, default: Role.user })
  role: Role;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ length: 20, unique: true })
  snils: string;

  @Column({ length: 20 })
  mobilePhone: string;

  @Column({ length: 10 })
  internalPhone: string;

  @Column({ length: 100 })
  position: string;

  @Column({ type: 'enum', enum: Department })
  department: Department;

  @Column({ length: 10, nullable: true })
  floor?: string;

  @Column({ length: 10, nullable: true })
  cabinet?: string;

  @Column({ type: 'bigint', nullable: true, unique: true })
  telegramUserId?: string;

  @ManyToMany(() => Equipment, (e) => e.assignedUsers)
  @JoinTable()
  assignedEquipment: Equipment[];

  @OneToMany(() => Request, (r) => r.user)
  requests: Request[];

  @OneToMany(() => Request, (r) => r.executor)
  assignedRequests: Request[];

  @OneToMany(() => Comment, (c) => c.user)
  comments: Comment[];

  @OneToMany(() => Notification, (n) => n.user)
  notifications: Notification[];

  @ManyToMany(() => Software, (s) => s.users)
  @JoinTable()
  software: Software[];
}
