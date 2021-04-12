import { Entity, Column, ManyToOne } from 'typeorm';
import { DbBaseEntity } from './db-base.entity';
import { User } from './user.entity';

@Entity({ name: 'friends' })
export class Friend extends DbBaseEntity {
  constructor(dto: Partial<Friend>) {
    super();
    Object.assign(this, dto);
  }

  @Column()
  email: string;

  @Column()
  canConfirm: boolean;

  @ManyToOne(type => User, user => user.friends, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  accepted: boolean;
}
