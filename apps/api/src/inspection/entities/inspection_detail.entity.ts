import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Inspection } from './inspection.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class InspectionDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'item' })
  item: string;

  @Column('jsonb', { name: 'options' })
  options: { name: string; description: string }[];

  @Column('jsonb', { name: 'condition', nullable: true })
  condition: { name: string; description: string };

  @Column({ name: 'notes' })
  notes: string;

  @Column({ name: 'photo_url' })
  photoUrl: string;

  @Column({ name: 'is_complete', default: false })
  isComplete: boolean;

  @ManyToOne(() => Inspection, (insp) => insp.id)
  @JoinColumn({ name: 'inspection_id' })
  inspection: Inspection;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'started_by' })
  startedBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
