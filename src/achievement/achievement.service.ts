import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from '../database/entities/achievement.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
  ) {
  }

  async getAchievements(user: User): Promise<Achievement[]> {

    const achievements = await this.achievementRepository
      .createQueryBuilder('achievement')
      .select([
        'achievement.id',
        'achievement.titleEN',
        'achievement.descriptionEN',
        'achievement.titlePL',
        'achievement.descriptionPL',
        'achievement.achieved',
      ])
      .leftJoin('achievement.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();

    return achievements;
  }

  async markAchievementAsAchieved(achievementId: string, user: User): Promise<void> {

    const achievement = await this.achievementRepository
      .createQueryBuilder('achievement')
      .select([
        'achievement.id',
        'achievement.titleEN',
        'achievement.descriptionEN',
        'achievement.titlePL',
        'achievement.descriptionPL',
        'achievement.achieved',
      ])
      .leftJoin('achievement.user', 'user')
      .where('achievement.id = :achievementId', { achievementId })
      .andWhere('user.id = :userId', { userId: user.id })
      .getOne();

    const updatedAchievement: Achievement = new Achievement ({
      ...achievement,
      achieved: true,
    });

    await this.achievementRepository.save(updatedAchievement);
  }
}
