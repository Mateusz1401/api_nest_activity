import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FriendService } from './friend.service';
import { InviteFriendDto } from './dto/invite-friend.dto';
import { Friend } from '../database/entities/friend.entity';
import { ConfirmFriendDto } from './dto/confirm-friend.dto';

@Controller('friend')
@ApiUseTags('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) { }

  @Post('invite')
  @ApiOperation({ title: 'Invite someone to friends' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async invite(@Req() request, @Body() inviteUserDto: InviteFriendDto) {
    return await this.friendService.invite(request.user, inviteUserDto);
  }

  @Get('getAllFriends')
  @ApiOperation({ title: 'Get all user\'s friends' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async getAllFriends(@Req() request): Promise<Friend[]> {
    return await this.friendService.getAllFriends(request.user);
  }

  @Post('acceptInvitation')
  @ApiOperation({ title: 'Accept invitation' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async acceptInvitation(@Req() request, @Body() confirmFriendDto: ConfirmFriendDto) {
    return await this.friendService.acceptInvitation(request.user, confirmFriendDto);
  }
}
