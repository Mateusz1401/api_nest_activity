import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodService } from './period.service';
import { PeriodController } from './period.controller';
import { CalendarModule } from '../calendar/calendar.module';
import { PeriodDate } from '../database/entities/period-date.entity';
import { CalendarDate } from '../database/entities/calendar-date.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PeriodDate, CalendarDate]),
    AuthModule,
  ],
  providers: [PeriodService],
  controllers: [PeriodController],
  exports: [PeriodService],
})
export class PeriodModule {}
