import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from '../database/entities/challenge.entity';
import { User } from '../database/entities/user.entity';
import { SendChallengeDto } from './dto/send-challenge.dto';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async getAllChallenges(userId: string): Promise<Challenge[]> {
    return await this.challengeRepository
      .createQueryBuilder('challenge')
      .where('challenge.userId = :id', { id: userId })
      .getMany();
  }

  async sendChallenge(user: User, sendChallengeDto: SendChallengeDto): Promise<void> {
    const foundUser = await this.userRepository.findOne({ email: sendChallengeDto.emailTo });

    if (!foundUser) {
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
    }

    if (user.email === sendChallengeDto.emailTo) {
      throw new HttpException('You cannot send challenge to yourself', HttpStatus.BAD_REQUEST);
    }

    const newChallenge = new Challenge({
      fromWho: user.email,
      challengeDate: sendChallengeDto.challengeDate,
      distance: sendChallengeDto.distance,
      done: false,
      user: foundUser,
    });

    await this.challengeRepository.save(newChallenge);
  }

  async markChallengeAsDone(challengeId: string, user: User): Promise<void> {

    const challenge = await this.challengeRepository
      .createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.user', 'user')
      .where('challenge.id = :challengeId', { challengeId })
      .andWhere('user.id = :userId', { userId: user.id })
      .getOne();

    if (!challenge) {
      throw new HttpException('Challenge does not exist', HttpStatus.BAD_REQUEST);
    }

    const updatedChallenge: Challenge = new Challenge ({
      ...challenge,
      done: true,
    });

    await this.challengeRepository.save(updatedChallenge);
  }
}
