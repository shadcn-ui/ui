import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from './user.entity';
import { Equipment } from './equipment.entity';

@Entity()
export class Software {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50, nullable: true })
  version?: string;

  @Column({ length: 255, nullable: true })
  licenseKey?: string;

  @Column({ length: 100, nullable: true })
  licensedTo?: string;

  @Column({ length: 50, nullable: true })
  adminLogin?: string;

  @Column({ length: 50, nullable: true })
  adminPassword?: string;

  @Column({ length: 100, nullable: true })
  networkAddress?: string;

  @Column({ length: 10, nullable: true })
  floor?: string;

  @Column({ length: 10, nullable: true })
  cabinet?: string;

  @Column({ type: 'timestamp', nullable: true })
  purchaseDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  supportStart?: Date;

  @Column({ type: 'timestamp', nullable: true })
  supportEnd?: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiryDate?: Date;

  @Column('text', { array: true, default: '{}' })
  fileUrls: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  installDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToMany(() => User, (u) => u.software)
  users: User[];

  @ManyToMany(() => Equipment, (e) => e.software)
  equipment: Equipment[];
}
