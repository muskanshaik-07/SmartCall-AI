import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  organization: string;

  @Column({ nullable: true })
  academicYear: string;

  @Column({ nullable: true })
  semester: string;

  @Column({ default: 'current' })
  dataStatus: string;
}