import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { DbBaseEntity } from './db-base.entity';

@Entity({ name: 'quests' })
export class Quest extends DbBaseEntity {
  constructor(dto: Partial<Quest>) {
    super();
    Object.assign(this, dto);
  }

  @Column()
  questDate: string;

  @Column()
  distance: string;

  @Column()
  done: boolean;

  @ManyToOne(type => User, user => user.quests, { onDelete: 'CASCADE' })
  user: User;
}
