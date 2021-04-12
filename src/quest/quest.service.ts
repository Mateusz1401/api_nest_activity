import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestDto } from './dto/create-quest.dto';
import { Quest } from '../database/entities/quest.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class QuestService {
  constructor(
    @InjectRepository(Quest)
    private readonly questRepository: Repository<Quest>,
  ) { }

  async createQuest(user: User, createQuestDto: CreateQuestDto): Promise<void> {

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    const newQuest = new Quest({
      ...createQuestDto,
      done: false,
      user,
    });

    await this.questRepository.save(newQuest);
  }

  async markQuestAsDone(questId: string, user: User): Promise<void> {

    const quest = await this.questRepository
      .createQueryBuilder('quest')
      .leftJoinAndSelect('quest.user', 'user')
      .where('quest.id = :questId', { questId })
      .andWhere('user.id = :userId', { userId: user.id })
      .getOne();

    if (!quest) {
      throw new HttpException('Quest does not exist', HttpStatus.BAD_REQUEST);
    }

    const updatedQuest: Quest = new Quest ({
      ...quest,
      done: true,
    });

    await this.questRepository.save(updatedQuest);
  }

  async getAllQuests(user: User): Promise<Quest[]> {
    return await this.questRepository
      .createQueryBuilder('quest')
      .select(['quest.id', 'quest.questDate', 'quest.distance', 'quest.done'])
      .where('quest.userId = :id', { id: user.id })
      .getMany();
  }
}
