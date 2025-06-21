import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Role, Department } from '../enums/user.enums';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId?: number;

  @Column({ type: 'enum', enum: Role, nullable: true })
  role?: Role;

  @Column({ type: 'enum', enum: Department, nullable: true })
  department?: Department;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (u) => u.notifications)
  user?: User;
}
