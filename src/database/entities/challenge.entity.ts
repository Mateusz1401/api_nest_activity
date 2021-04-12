import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { DbBaseEntity } from './db-base.entity';

@Entity({ name: 'challenges' })
export class Challenge extends DbBaseEntity {
  constructor(dto: Partial<Challenge>) {
    super();
    Object.assign(this, dto);
  }

  @Column()
  fromWho: string;

  @Column()
  challengeDate: string;

  @Column()
  distance: string;

  @Column()
  done: boolean;

  @ManyToOne(type => User, user => user.challenges, { onDelete: 'CASCADE' })
  user: User;
}
