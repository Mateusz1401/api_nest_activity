import { Controller, Get, UseGuards, Req, Patch, Body } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Achievement } from '../database/entities/achievement.entity';
import { AchievementService } from './achievement.service';
import { AuthGuard } from '@nestjs/passport';
import { MarkDoneAchievementDto } from './dto/mark-done-achievement.dto';

@Controller('achievement')
@ApiUseTags('achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) { }

  @Get('getAchievements')
  @ApiOperation({ title: 'Get user\'s achievements' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async getAchievements(@Req() request): Promise<Achievement[]> {
    return await this.achievementService.getAchievements(request.user);
  }

  @Patch('markAsAchieved')
  @ApiOperation({ title: 'mark achievement as achieved' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async markAchievementAsAchieved(@Body() markDoneAchievementDto: MarkDoneAchievementDto, @Req() request): Promise<void> {
    return await this.achievementService.markAchievementAsAchieved(markDoneAchievementDto.id, request.user);
  }
}
