import { Entity, Column, ManyToOne } from 'typeorm';
import { DbBaseEntity } from './db-base.entity';
import { CalendarDate } from './calendar-date.entity';

@Entity({ name: 'period_dates' })
export class PeriodDate extends DbBaseEntity {
  constructor(dto: Partial<PeriodDate>) {
    super();
    Object.assign(this, dto);
  }

  @ManyToOne(type => CalendarDate, calendarDate => calendarDate, { onDelete: 'CASCADE' })
  calendarDate: CalendarDate;

  @Column()
  distance: string;

  @Column()
  calories: string;

  @Column()
  averageSpeed: string;
}
