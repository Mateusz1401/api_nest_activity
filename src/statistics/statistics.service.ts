import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sortBy, find } from 'lodash';
import { CalendarDate } from '../database/entities/calendar-date.entity';
import { formatDateString } from '../calendar/date';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(CalendarDate)
    private readonly calendarRepository: Repository<CalendarDate>,
  ) { }

  getDaysInMonth(month, year) {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      if (formatDateString(date) === formatDateString(new Date())) {
        break;
      }
      days.push(formatDateString(new Date(date)));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  async getDistanceMonthStatistics(userId: string): Promise<number[]> {
    const days = this.getDaysInMonth(new Date().getMonth(), new Date().getFullYear());

    const calendarDates = await this.calendarRepository
      .createQueryBuilder('calendarDate')
      .select(['calendarDate.id', 'calendarDate.date', 'calendarDate.distanceTotal', 'calendarDate.caloriesTotal', 'calendarDate.averageSpeedTotal'])
      .where('calendarDate.userId = :id', { id: userId })
      .andWhere('calendarDate.date >= :minDate', { minDate: days[0] })
      .andWhere('calendarDate.date <= :maxDate', { maxDate: days[days.length - 1] })
      .getMany();

    const periods = calendarDates.map((element) => {
      return {date: element.date, averageDistance: parseFloat(element.distanceTotal)};
    });

    const sortedArray = sortBy(periods, y => y.date);

    days.forEach(element => {
      if (!find(sortedArray, z => formatDateString(z.date) === formatDateString(element))) {
        sortedArray.push({date: element, averageDistance: 0});
      }
    });

    const responseData = sortedArray.map((element) => {
      return element.averageDistance;
    });

    return responseData;
  }
}
