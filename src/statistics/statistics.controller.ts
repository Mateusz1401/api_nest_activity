import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
@ApiUseTags('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) { }

  @Get('getDistanceMonthStatistics')
  @ApiOperation({ title: 'get distance\'s month statistics' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async getDistanceMonthStatistics(@Req() request): Promise<number[]> {
    return await this.statisticsService.getDistanceMonthStatistics(request.user.id);
  }
}
