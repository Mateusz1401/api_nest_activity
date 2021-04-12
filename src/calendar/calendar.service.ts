import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sortBy, sum } from 'lodash';
import { CreateCalendarDateDto } from '../calendar/dto/create-calendar-date.dto';
import { UpdateCalendarDateDto } from '../calendar/dto/update-calendar-date.dto';
import { CalendarDate } from '../database/entities/calendar-date.entity';
import { User } from '../database/entities/user.entity';
import { formatDateString } from './date';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarDate)
    private readonly calendarRepository: Repository<CalendarDate>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async addDay(user: User, createCalendarDateDto: CreateCalendarDateDto): Promise<void> {

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    const newCalendarDate = new CalendarDate({
      ...createCalendarDateDto,
      user,
    });

    await this.calendarRepository.save(newCalendarDate);
  }

  async getCalendar(user: User): Promise<CalendarDate[]> {
    return await this.calendarRepository
      .createQueryBuilder('calendarDate')
      .select(['calendarDate.id', 'calendarDate.date', 'calendarDate.distanceTotal', 'calendarDate.caloriesTotal', 'calendarDate.averageSpeedTotal', 'calendarDate.star', 'period.id', 'period.distance', 'period.calories', 'period.averageSpeed'])
      .leftJoin('calendarDate.periods', 'period')
      .where('calendarDate.userId = :id', { id: user.id })
      .getMany();
  }

  async addDayToAllUsers(): Promise<void> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.calendar', 'calendar')
      .leftJoinAndSelect('calendar.periods', 'periods')
      .getMany();

    const calendarDates: CalendarDate[] = [];

    users.forEach(async user => {
      const days = sortBy(user.calendar, x => x.date);
      const yesterday = days[days.length - 1];

      const distanceTotal = yesterday.periods.map(x => parseFloat(x.distance));
      const caloriesTotal = yesterday.periods.map(x => parseFloat(x.calories));
      const averageSpeedTotal = yesterday.periods.map(x => parseFloat(x.averageSpeed));

      const updatedYesterday: CalendarDate = new CalendarDate ({
        ...yesterday,
        distanceTotal: (sum(distanceTotal) / distanceTotal.length).toFixed(2),
        caloriesTotal: (sum(caloriesTotal) / caloriesTotal.length).toFixed(2),
        averageSpeedTotal: (sum(averageSpeedTotal) / averageSpeedTotal.length).toFixed(2),
      });

      calendarDates.push(updatedYesterday);

      calendarDates.push(new CalendarDate({
        date: formatDateString(new Date()),
        user,
       }));
    });

    await this.calendarRepository.save(calendarDates);
  }

  async updateCalendarDate(user: User, updateCalendarDateDto: UpdateCalendarDateDto): Promise<void> {

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    const foundCalendarDate = await this.calendarRepository
      .createQueryBuilder('calendarDate')
      .leftJoinAndSelect('calendarDate.user', 'user')
      .andWhere('user.id = :userId', { userId: user.id })
      .where('calendarDate.date = :calendarDate', { calendarDate: updateCalendarDateDto.calendarDate })
      .getOne();

    if (!foundCalendarDate) {
      throw new HttpException('Calendar Date does not exist', HttpStatus.BAD_REQUEST);
    }

    const newCalendarDate: CalendarDate = new CalendarDate ({
      ...foundCalendarDate,
      ...updateCalendarDateDto,
      user,
    });

    await this.calendarRepository.save(newCalendarDate);
  }
}
