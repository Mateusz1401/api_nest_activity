import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { Friend } from '../database/entities/friend.entity';
import { User } from '../database/entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friend, User]),
    AuthModule,
  ],
  providers: [FriendService],
  controllers: [FriendController],
  exports: [FriendService],

})
export class FriendModule { }
