import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangingPasswordDto } from './dto/changing-password.dto';
import { RecalculateTrening } from './dto/recalculate-trening.dto';
import { User } from '../database/entities/user.entity';
import { getAchievements } from '../achievement/achievementsData';
import { Achievement } from '../database/entities/achievement.entity';
import { Quest } from '../database/entities/quest.entity';
import { Challenge } from '../database/entities/challenge.entity';
import { CalendarDate } from '../database/entities/calendar-date.entity';
import { suitBMItoRange } from './selectors/treningPlans';
import { calculateBMI, calculateBMR, calculateCPM } from './selectors/algorithms';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
    @InjectRepository(Quest)
    private readonly questRepository: Repository<Quest>,
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
    @InjectRepository(CalendarDate)
    private readonly calendarRepository: Repository<CalendarDate>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<void> {

    const age = new Date().getFullYear() - new Date(parseInt(createUserDto.birthDate.split('-')[2], 10), parseInt(createUserDto.birthDate.split('-')[1], 10), parseInt(createUserDto.birthDate.split('-')[0], 10)).getFullYear();

    if (age < 3) throw new HttpException('The minimum age is 3', HttpStatus.BAD_REQUEST);

    const foundUser = await this.userRepository.findOne({ email: createUserDto.email });

    if (foundUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const bmi = calculateBMI(createUserDto.weight, createUserDto.height);
    const bmr = calculateBMR(createUserDto.weight, createUserDto.height, createUserDto.sex, createUserDto.birthDate);

    const newUser = new User({
      ...createUserDto,
      password: bcrypt.hashSync(createUserDto.password, 10),
      bmi,
      treningPlan: suitBMItoRange(bmi, createUserDto.sex, createUserDto.birthDate),
      bmr,
      cpm: calculateCPM(bmr, createUserDto.job, createUserDto.activity),
      firstLogin: true,
    });

    await this.userRepository.save(newUser);

    const achievementsFromFile = getAchievements();
    const achievements: Achievement[] = [];

    achievementsFromFile.forEach(async achievement => {
      achievements.push(new Achievement({ ...achievement, achieved: false, user: newUser }));
    });

    await this.achievementRepository.save(achievements);
  }

  async getUser(user: User): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.firstName', 'user.lastName', 'user.birthDate', 'user.email', 'user.sex', 'user.weight', 'user.height', 'user.bmi', 'user.treningPlan', 'user.bmr', 'user.cpm', 'user.firstLogin'])
      .where('user.id = :id', { id: user.id })
      .getOne();
  }

  async delete(user: User): Promise<void> {

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    await this.userRepository.delete(user);
  }

  async update(user: User, updateUserDto: UpdateUserDto): Promise<void> {

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    const updatedUser: User = new User({
      ...user,
      ...updateUserDto,
    });

    await this.userRepository.save(updatedUser);
  }

  async changePassword(user: User, changingPasswordDto: ChangingPasswordDto): Promise<void> {

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    if (!bcrypt.compareSync(changingPasswordDto.oldPassword, user.password)) {
      throw new HttpException('Old password is wrong', HttpStatus.BAD_REQUEST);
    }

    const updatedUser: User = new User({
      ...user,
      ...changingPasswordDto,
      password: bcrypt.hashSync(changingPasswordDto.password, 10),
    });

    await this.userRepository.save(updatedUser);
  }

  async noFirstLogin(user: User): Promise<void> {

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    const updatedUser: User = new User({
      ...user,
      firstLogin: false,
    });

    await this.userRepository.save(updatedUser);
  }

  async clearProgress(user: User): Promise<void> {

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    const fullUser = await this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.calendar', 'calendar')
    .leftJoinAndSelect('calendar.periods', 'periods')
    .leftJoinAndSelect('user.quests', 'quests')
    .leftJoinAndSelect('user.challenges', 'challenges')
    .leftJoinAndSelect('user.achievements', 'achievements')
    .where('user.id = :id', { id: user.id })
    .getOne();

    if (fullUser.quests.length !== 0) await this.questRepository.remove(fullUser.quests);
    if (fullUser.challenges.length !== 0) await this.challengeRepository.remove(fullUser.challenges);
    if (fullUser.calendar.length !== 0) await this.calendarRepository.remove(fullUser.calendar);

    if (fullUser.achievements.length !== 0) {
      await this.achievementRepository.remove(fullUser.achievements);
      const achievementsFromFile = getAchievements();
      const achievements: Achievement[] = [];

      achievementsFromFile.forEach(async achievement => {
        achievements.push(new Achievement({ ...achievement, achieved: false, user }));
      });

      await this.achievementRepository.save(achievements);
    }

    const updatedUser: User = new User({
      ...user,
      firstLogin: true,
    });

    await this.userRepository.save(updatedUser);
  }

  async recalculateBMIandTreningPlan(recalculateTrening: RecalculateTrening, user: User): Promise<void> {

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    const bmi = calculateBMI(recalculateTrening.weight, recalculateTrening.height);
    const bmr = calculateBMR(recalculateTrening.weight, recalculateTrening.height, user.sex, user.birthDate);

    const updatedUser: User = new User({
      ...user,
      weight: recalculateTrening.weight,
      height: recalculateTrening.height,
      bmi,
      treningPlan: suitBMItoRange(bmi, user.sex, user.birthDate),
      bmr,
      cpm: calculateCPM(bmr, recalculateTrening.job, recalculateTrening.activity),
    });

    await this.userRepository.save(updatedUser);
  }
}
