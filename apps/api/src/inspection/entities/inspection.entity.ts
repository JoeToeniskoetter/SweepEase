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
import { InspectionTemplate } from './inspection_template.entity';
import { InspectionSignature } from './inspection_signature.entity';

@Entity()
export class Inspection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'status', enum: ['NEW', 'IN PROGRESS', 'COMPLETE'] })
  status: string;

  @Column({ name: 'customer_name' })
  customerName: string;

  @Column({ name: 'address' })
  address: string;

  @Column({ name: 'city' })
  city: string;

  @Column({ name: 'state' })
  state: string;

  @Column({ name: 'zip' })
  zip: string;

  @Column({ name: 'phone' })
  phone: string;

  @ManyToOne(() => Company, (company) => company.id)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(
    () => InspectionTemplate,
    (inspectionTemplate) => inspectionTemplate.id,
  )
  @JoinColumn({ name: 'template_id' })
  template: InspectionTemplate;

  @OneToMany(() => InspectionSignature, (sig) => sig.inspection)
  signatures: InspectionSignature[];

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
