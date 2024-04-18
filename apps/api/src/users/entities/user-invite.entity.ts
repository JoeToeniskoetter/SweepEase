import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Company } from 'src/company/entities/company.entity';

@Entity()
export class UserInvite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'verification_code' })
  verificationCode: string;

  @Column({ name: 'user_email' })
  userEmail: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @ManyToOne(() => Company, (company) => company.id)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
