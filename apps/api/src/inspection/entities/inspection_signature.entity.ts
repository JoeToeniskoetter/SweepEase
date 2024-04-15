import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Inspection } from './inspection.entity';

@Entity()
export class InspectionSignature extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @ManyToOne(() => Inspection, (insp) => insp.id)
  @JoinColumn({ name: 'inspection_id' })
  inspection: Inspection;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
