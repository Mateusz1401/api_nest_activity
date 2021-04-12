import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InviteFriendDto } from './dto/invite-friend.dto';
import { Friend } from '../database/entities/friend.entity';
import { User } from '../database/entities/user.entity';
import { ConfirmFriendDto } from './dto/confirm-friend.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async invite(user: User, inviteFriendDto: InviteFriendDto) {
    const senderUser = await this.userRepository.findOne({ id: user.id });
    const invitedUser = await this.userRepository.findOne({ email: inviteFriendDto.receiverEmail });

    if (!invitedUser || !senderUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    if (invitedUser.email === senderUser.email) {
      throw new HttpException('You cannot invite myself', HttpStatus.BAD_REQUEST);
    }

    const fr = await this.friendRepository
      .createQueryBuilder('friend')
      .where('friend.userId = :id', { id: user.id })
      .getOne();

    const sd = await this.friendRepository
      .createQueryBuilder('friend')
      .where('friend.email = :email', { email: inviteFriendDto.receiverEmail })
      .getOne();

    if (fr && sd) {
      throw new HttpException('Invitation has been sent', HttpStatus.BAD_REQUEST);
    }

    const friend1 = new Friend({
      email: senderUser.email,
      accepted: false,
      canConfirm: true,
      user: invitedUser,
    });

    const friend2 = new Friend({
      email: invitedUser.email,
      accepted: false,
      canConfirm: false,
      user: senderUser,
    });

    await this.friendRepository.save(friend1);
    await this.friendRepository.save(friend2);
  }

  async getAllFriends(user: User): Promise<Friend[]> {
    return await this.friendRepository
      .createQueryBuilder('friend')
      .where('friend.userId = :id', { id: user.id })
      .getMany();
  }

  async acceptInvitation(user: User, confirmFriendDto: ConfirmFriendDto) {
    if (!user || !confirmFriendDto.email) {
      throw new HttpException('The data is not complete', HttpStatus.BAD_REQUEST);
    }

    const oneOfFriend = await this.userRepository.findOne({ email: confirmFriendDto.email });

    const fr = await this.friendRepository
      .createQueryBuilder('friend')
      .where('friend.userId = :id', { id: user.id })
      .andWhere('friend.email = :email', { email: confirmFriendDto.email })
      .getOne();

    const sd = await this.friendRepository
    .createQueryBuilder('friend')
    .where('friend.email = :email', { email: user.email })
    .andWhere('friend.userId = :id', { id: oneOfFriend.id })
    .getOne();

    const updatedFriend1: Friend = new Friend({
      ...fr,
      accepted: true,
    });

    const updatedFriend2: Friend = new Friend({
      ...sd,
      accepted: true,
    });

    await this.friendRepository.save(updatedFriend1);
    await this.friendRepository.save(updatedFriend2);
  }
}
