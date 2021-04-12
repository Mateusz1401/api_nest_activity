import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { User } from '../database/entities/user.entity';
import { Achievement } from '../database/entities/achievement.entity';
import { Quest } from '../database/entities/quest.entity';
import { Challenge } from '../database/entities/challenge.entity';
import { CalendarDate } from '../database/entities/calendar-date.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Achievement, Quest, Challenge, CalendarDate]),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
