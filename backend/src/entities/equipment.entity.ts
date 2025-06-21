import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Software } from './software.entity';

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  inventoryNumber: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  type: string;

  @Column({ length: 50, nullable: true })
  macAddress?: string;

  @Column({ length: 50, nullable: true })
  ipAddress?: string;

  @Column({ length: 50, nullable: true })
  login?: string;

  @Column({ length: 50, nullable: true })
  password?: string;

  @Column({ length: 50 })
  location: string;

  @Column({ length: 10, nullable: true })
  floor?: string;

  @Column({ length: 10, nullable: true })
  cabinet?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('text', { array: true, default: '{}' })
  fileUrls: string[];

  @Column({ nullable: true })
  assignedToUserId?: number;

  @ManyToOne(() => User, (u) => u.assignedEquipment, { nullable: true })
  @JoinColumn({ name: 'assignedToUserId' })
  assignedTo?: User;

  @ManyToMany(() => User, (u) => u.assignedEquipment)
  assignedUsers: User[];

  @ManyToMany(() => Software, (s) => s.equipment)
  @JoinTable()
  software: Software[];
}
