import { Entity, Column, ManyToOne } from 'typeorm';
import { DbBaseEntity } from './db-base.entity';
import { User } from './user.entity';

@Entity({ name: 'achievements' })
export class Achievement extends DbBaseEntity {
  constructor(dto: Partial<Achievement>) {
    super();
    Object.assign(this, dto);
  }

  @Column()
  titleEN: string;

  @Column()
  descriptionEN: string;

  @Column()
  titlePL: string;

  @Column()
  descriptionPL: string;

  @Column()
  achieved: boolean;

  @ManyToOne(type => User, user => user.achievements, { onDelete: 'CASCADE' })
  user: User;
}
