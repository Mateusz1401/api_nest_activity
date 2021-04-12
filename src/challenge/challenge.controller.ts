import { Controller, Get, UseGuards, Req, Patch, Post, Body } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChallengeService } from './challenge.service';
import { Challenge } from '../database/entities/challenge.entity';
import { SendChallengeDto } from './dto/send-challenge.dto';
import { MarkDoneChallengeDto } from './dto/mark-done-challenge.dto';

@Controller('challenge')
@ApiUseTags('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) { }

  @Get('getAllChallenges')
  @ApiOperation({ title: 'Get user\'s challenges' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async getAllChallenges(@Req() request): Promise<Challenge[]> {
    return await this.challengeService.getAllChallenges(request.user.id);
  }

  @Post('sendChallenge')
  @ApiOperation({ title: 'Send challenge to friend' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async sendChallenge(@Req() request, @Body() sendChallengeDto: SendChallengeDto): Promise<void> {
    return await this.challengeService.sendChallenge(request.user, sendChallengeDto);
  }

  @Patch('markAsDone')
  @ApiOperation({ title: 'mark challenge as done' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async markChallengeAsDone(@Body() markDoneChallengeDto: MarkDoneChallengeDto, @Req() request): Promise<void> {
    return await this.challengeService.markChallengeAsDone(markDoneChallengeDto.id, request.user);
  }
}
