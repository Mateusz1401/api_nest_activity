import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { MailerModule } from '@nest-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CalendarModule } from './calendar/calendar.module';
import { PeriodModule } from './period/period.module';
import { FriendModule } from './friend/friend.module';
import { EmailModule } from './email/email.module';
import { QuestModule } from './quest/quest.module';
import { ChallengeModule } from './challenge/challenge.module';
import { AchievementModule } from './achievement/achievement.module';
import { SeedModule } from './database/seed.module';
import { StatisticsModule } from './statistics/statistics.module';
import MailerConfig from '../mailerconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    MailerModule.forRoot(MailerConfig),
    UserModule,
    CalendarModule,
    PeriodModule,
    AuthModule,
    FriendModule,
    EmailModule,
    QuestModule,
    ChallengeModule,
    AchievementModule,
    SeedModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) { }
}
