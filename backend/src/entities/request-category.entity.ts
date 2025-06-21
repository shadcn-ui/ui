import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class RequestCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;
}
