import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InspectionTemaplateSection extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  // @ManyToOne(() => InspectionTemplate, (template) => template.id)
  // @JoinColumn({ name: 'template_id' })
  // template: InspectionTemplate;

  // @OneToMany(() => InspectionTemplateItem, (item) => item.section)
  // items: InspectionTemplateItem[];
}
