import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarService } from '../calendar/calendar.service';
import { CreatePeriodDto } from './dto/create-period.dto';
import { PeriodDate } from '../database/entities/period-date.entity';
import { CalendarDate } from '../database/entities/calendar-date.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class PeriodService {
  constructor(
    @InjectRepository(PeriodDate)
    private readonly periodRepository: Repository<PeriodDate>,
    @InjectRepository(CalendarDate)
    private readonly calendarRepository: Repository<CalendarDate>,
  ) { }

  async addPeriodDate(user: User, createPeriodDto: CreatePeriodDto): Promise<void> {

    const foundCalendarDate = await this.calendarRepository
      .createQueryBuilder('calendarDate')
      .leftJoinAndSelect('calendarDate.user', 'user')
      .andWhere('user.id = :userId', { userId: user.id })
      .where('calendarDate.date = :calendarDate', { calendarDate: createPeriodDto.calendarDate })
      .getOne();

    if (!foundCalendarDate) {
      throw new HttpException('Calendar Date does not exist', HttpStatus.BAD_REQUEST);
    }

    const newPeriodDate = new PeriodDate({
      ...createPeriodDto,
      calendarDate: foundCalendarDate,
    });

    await this.periodRepository.save(newPeriodDate);
  }
}
