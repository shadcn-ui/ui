import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { RequestStatus, Priority, RequestSource } from '../enums/request.enums';

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.NEW })
  status: RequestStatus;

  @Column({ type: 'enum', enum: Priority, default: Priority.NORMAL })
  priority: Priority;

  @Column({ length: 50, nullable: true })
  category?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expectedResolutionDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  assignedAt?: Date;

  @Column({ type: 'int', nullable: true })
  workDuration?: number;

  @Column({ type: 'enum', enum: RequestSource, default: RequestSource.WEB, nullable: true })
  source?: RequestSource;

  @Column()
  userId: number;

  @ManyToOne(() => User, (u) => u.requests)
  user: User;

  @Column({ nullable: true })
  executorId?: number;

  @ManyToOne(() => User, (u) => u.assignedRequests)
  executor?: User;

  @Column({ type: 'int', nullable: true })
  rating?: number;

  @Column({ type: 'text', nullable: true })
  feedback?: string;

  @Column('text', { array: true, default: '{}' })
  fileUrls: string[];

  @OneToMany(() => Comment, (c) => c.request)
  comments: Comment[];
}
