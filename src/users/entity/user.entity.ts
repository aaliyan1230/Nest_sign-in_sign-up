import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class UserEntity {
  @ObjectIdColumn() id: ObjectID;
  @Column({ type: 'varchar', nullable: false, unique: true }) username: string;
  @Column({ type: 'varchar', nullable: false }) password: string;
  @Column({ type: 'varchar', nullable: false }) email: string;
  @CreateDateColumn() createdOn?: Date;
  @CreateDateColumn() updatedOn?: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}