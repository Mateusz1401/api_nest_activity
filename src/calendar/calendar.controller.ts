import { Controller, UseGuards, Body, Post, Get, Req, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CalendarService } from './calendar.service';
import { CreateCalendarDateDto } from '../calendar/dto/create-calendar-date.dto';
import { UpdateCalendarDateDto } from '../calendar/dto/update-calendar-date.dto';
import { CalendarDate } from '../database/entities/calendar-date.entity';

@Controller('calendar')
@ApiUseTags('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) { }

  @Post('addDay')
  @ApiOperation({ title: 'Add day to user\'s calendar' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async addDay(@Req() request, @Body() createCalendarDateDto: CreateCalendarDateDto): Promise<void> {
    return await this.calendarService.addDay(request.user, createCalendarDateDto);
  }

  @Get('getCalendar')
  @ApiOperation({ title: 'Get user\'s calendar' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async getCalendar(@Req() request): Promise<CalendarDate[]> {
    return await this.calendarService.getCalendar(request.user);
  }

  @Patch('update-parameters')
  @ApiOperation({ title: 'Update calendar\'s parameters' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async updateCalendarDate(@Req() request, @Body() updateCalendarDateDto: UpdateCalendarDateDto): Promise<void> {
    return await this.calendarService.updateCalendarDate(request.user, updateCalendarDateDto);
  }
}
