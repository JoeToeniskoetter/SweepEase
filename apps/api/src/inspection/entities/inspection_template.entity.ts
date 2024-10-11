import { Company } from 'src/company/entities/company.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InspectionTemplateItem } from './inspection_template_items.entity';

export enum InspectionLevel {
  LEVEL_ONE = 'Level One',
  LEVEL_TWO = 'Level Two',
  LEVEL_THREE = 'Level Three',
}

@Entity()
export class InspectionTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'inspection_level', enum: ['Level 1', 'Level 2', 'Level 3'] })
  inspectionLevel: string;

  @Column({ name: 'signatures_required', default: false })
  signaturesRequired: boolean;

  @Column({ default: true })
  canEdit: boolean;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToMany(() => InspectionTemplateItem, (item) => item.template, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  items: InspectionTemplateItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
