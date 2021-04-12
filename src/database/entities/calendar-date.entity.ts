import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { DbBaseEntity } from './db-base.entity';
import { User } from './user.entity';
import { PeriodDate } from './period-date.entity';

@Entity({ name: 'calendar_dates' })
export class CalendarDate extends DbBaseEntity {
  constructor(dto: Partial<CalendarDate>) {
    super();
    Object.assign(this, dto);
  }

  @Column()
  date: string;

  @Column({ default: '0' })
  distanceTotal: string;

  @Column({ default: '0' })
  caloriesTotal: string;

  @Column({ default: '0' })
  averageSpeedTotal: string;

  @Column({ default: false })
  star: boolean;

  @ManyToOne(type => User, user => user.calendar, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(type => PeriodDate, periodDate => periodDate.calendarDate)
  periods: PeriodDate[];
}
