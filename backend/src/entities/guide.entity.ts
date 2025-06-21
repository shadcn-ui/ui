import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Guide {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  fileUrl?: string;

  @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
