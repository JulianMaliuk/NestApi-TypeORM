// import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  Index,
  AfterLoad,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  name: string;

  @Index({ unique: true })
  @Column({ nullable: false })
  username: string;

  @Column({ nullable: true, select: false })
  // @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ type: 'set', enum: ['user', 'admin'], default: ['user'] })
  roles: string[];

  @Column({ default: true })
  isActive: boolean;

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword() {
    if (!!this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
