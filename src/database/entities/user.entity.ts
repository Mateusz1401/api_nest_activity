import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { DbBaseEntity } from './db-base.entity';
import { RefreshToken } from '../../database/entities/refreshToken.entity';
import { CalendarDate } from './calendar-date.entity';
import { Friend } from './friend.entity';
import { Quest } from './quest.entity';
import { Challenge } from './challenge.entity';
import { Achievement } from './achievement.entity';
import { Sex } from '../../enums/Sex';

@Entity({ name: 'users' })
export class User extends DbBaseEntity {
  constructor(dto: Partial<User>) {
    super();
    Object.assign(this, dto);
  }

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  birthDate: string;

  @Column()
  email: string;

  @Column()
  sex: Sex;

  @Column()
  weight: string;

  @Column()
  height: string;

  @Column()
  bmi: string;

  @Column()
  treningPlan: number;

  @Column()
  bmr: string;

  @Column()
  cpm: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  resetCode: string;

  @Column()
  firstLogin: boolean;

  @OneToOne(type => RefreshToken, refreshToken => refreshToken.value, { cascade: true })
  @JoinColumn()
  refreshToken: RefreshToken;

  @OneToMany(type => CalendarDate, calendarDate => calendarDate.user)
  calendar: CalendarDate[];

  @OneToMany(type => Friend, friend => friend.user)
  friends: Friend[];

  @OneToMany(type => Quest, quest => quest.user)
  quests: Quest[];

  @OneToMany(type => Challenge, challenge => challenge.user)
  challenges: Challenge[];

  @OneToMany(type => Achievement, achievement => achievement.user)
  achievements: Achievement[];
}
