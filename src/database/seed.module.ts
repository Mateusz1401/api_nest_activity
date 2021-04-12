import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { AuthModule } from '../auth/auth.module';
import { User } from './entities/user.entity';
import { Achievement } from './entities/achievement.entity';
import { CalendarDate } from './entities/calendar-date.entity';
import { PeriodDate } from './entities/period-date.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Achievement, CalendarDate, PeriodDate]),
    AuthModule,
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
