import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { User } from './user.entity';
import { Request } from './request.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Index()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User, (u) => u.comments)
  user: User;

  @Column()
  requestId: number;

  @ManyToOne(() => Request, (r) => r.comments)
  request: Request;
}
