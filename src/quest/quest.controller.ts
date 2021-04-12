import { Controller, Post, UseGuards, Body, Get, Req, Patch } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { QuestService } from './quest.service';
import { CreateQuestDto } from './dto/create-quest.dto';
import { Quest } from '../database/entities/quest.entity';
import { MarkDoneQuestDto } from './dto/mark-done-quest.dto';

@Controller('quest')
@ApiUseTags('quest')
export class QuestController {
  constructor(private readonly questService: QuestService) { }

  @Post('createQuest')
  @ApiOperation({ title: 'createQuest' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async createQuest(@Req() request, @Body() createQuestDto: CreateQuestDto): Promise<void> {
    return await this.questService.createQuest(request.user, createQuestDto);
  }

  @Patch('markAsDone')
  @ApiOperation({ title: 'mark quest as done' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async markQuestAsDone(@Body() markDoneQuestDto: MarkDoneQuestDto, @Req() request): Promise<void> {
    return await this.questService.markQuestAsDone(markDoneQuestDto.id, request.user);
  }

  @Get('getAllQuests')
  @ApiOperation({ title: 'Get user\'s quests' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async getAllQuests(@Req() request): Promise<Quest[]> {
    return await this.questService.getAllQuests(request.user);
  }
}
