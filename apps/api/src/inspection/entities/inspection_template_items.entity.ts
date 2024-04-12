import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InspectionTemplateOptions } from './inspection_template_options.entity';
import { InspectionTemplate } from './inspection_template.entity';

@Entity()
export class InspectionTemplateItem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'position' })
  position: number;

  @ManyToOne(() => InspectionTemplate, (template) => template.id)
  @JoinColumn({ name: 'template_id' })
  template: InspectionTemplate;

  @OneToMany(() => InspectionTemplateOptions, (options) => options.item, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  options: InspectionTemplateOptions[];
}
