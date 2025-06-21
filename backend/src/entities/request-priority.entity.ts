import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class RequestPriority {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  code: string;

  @Column({ length: 50 })
  name: string;
}
