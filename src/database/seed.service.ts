import { Job } from './../enums/job';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Achievement } from './entities/achievement.entity';
import { getAchievements } from '../achievement/achievementsData';
import { CalendarDate } from './entities/calendar-date.entity';
import { Sex } from '../enums/Sex';
import { formatDateString } from '../calendar/date';
import { PeriodDate } from './entities/period-date.entity';
import { calculateBMI, calculateBMR, calculateCPM } from '../user/selectors/algorithms';
import { suitBMItoRange } from '../user/selectors/treningPlans';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
    @InjectRepository(CalendarDate)
    private readonly calendarRepository: Repository<CalendarDate>,
    @InjectRepository(PeriodDate)
    private readonly periodRepository: Repository<PeriodDate>,
  ) {
  }

  getDateArray(start, end) {
    const arr = new Array();
    const dt = new Date(start);

    while (dt <= end) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }

    return arr;
  }

  async runSeed(): Promise<void> {
    const weight = '69.2';
    const height = '170.5';

    const bmi = calculateBMI(weight, height);
    const bmr = calculateBMR(weight, height, Sex.Male, '12-05-1996');

    const newUser = new User({
      firstName: 'Jan',
      lastName: 'Nowak',
      birthDate: '12-05-1996',
      email: 'jan.nowak@admin.com',
      sex: Sex.Male,
      weight,
      height,
      bmi,
      treningPlan: suitBMItoRange(bmi, Sex.Male, '12-05-1996'),
      bmr,
      cpm: calculateCPM(bmr, Job.Sitting, 2),
      password: bcrypt.hashSync('1234', 10),
      firstLogin: true,
    });

    const user = await this.userRepository.findOne({ email: newUser.email });

    if (user) {
      return;
    }

    await this.userRepository.save(newUser);

    const achievementsFromFile = getAchievements();
    const achievements: Achievement[] = [];

    achievementsFromFile.forEach(async achievement => {
      achievements.push(new Achievement({ ...achievement, achieved: false, user: newUser }));
    });

    await this.achievementRepository.save(achievements);

    const startDate = new Date('2019-07-01');
    const endDate = new Date();

    const datesFromPeriods = this.getDateArray(startDate, endDate);

    const datesToSave: CalendarDate[] = [];
    const periodsToSave: PeriodDate[] = [];

    datesFromPeriods.forEach(async (element, index) => {
      const newCalendarDate = new CalendarDate({
        date: formatDateString(element),
        user: newUser,
      });
      datesToSave.push(newCalendarDate);

      const newPeriodDate1 = new PeriodDate({
        calendarDate: newCalendarDate,
        distance: (Math.floor(Math.random() * 10000) + 1).toString(),
        calories: (Math.floor(Math.random() * 3000) + 1).toString(),
        averageSpeed: (Math.floor(Math.random() * 40) + 1).toString(),
      });

      periodsToSave.push(newPeriodDate1);

      const newPeriodDate2 = new PeriodDate({
        calendarDate: newCalendarDate,
        distance: (Math.floor(Math.random() * 10000) + 1).toString(),
        calories: (Math.floor(Math.random() * 3000) + 1).toString(),
        averageSpeed: (Math.floor(Math.random() * 40) + 1).toString(),
      });

      periodsToSave.push(newPeriodDate2);
    });

    this.calendarRepository.save(datesToSave);
    this.periodRepository.save(periodsToSave);
  }
}
