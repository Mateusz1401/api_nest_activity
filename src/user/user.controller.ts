import { Controller, Get, Post, Body, Delete, Patch, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RecalculateTrening } from './dto/recalculate-trening.dto';
import { ChangingPasswordDto } from './dto/changing-password.dto';
import { User } from '../database/entities/user.entity';

@Controller('user')
@ApiUseTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService) { }

  @Post('create')
  @ApiOperation({ title: 'Create user' })
  async create(@Body() createUserDto: CreateUserDto): Promise<void> {
    return await this.userService.create(createUserDto);
  }

  @Get('get')
  @ApiOperation({ title: 'Get user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async getUser(@Req() request): Promise<User> {
    return await this.userService.getUser(request.user);
  }

  @Delete('delete')
  @ApiOperation({ title: 'Delete user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async delete(@Req() request): Promise<void> {
    return await this.userService.delete(request.user);
  }

  @Patch('update')
  @ApiOperation({ title: 'Update user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async update(@Req() request, @Body() updateUserDto: UpdateUserDto): Promise<void> {
    return await this.userService.update(request.user, updateUserDto);
  }

  @Patch('changePassword')
  @ApiOperation({ title: 'Change user\'s password' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async changePassword(@Req() request, @Body() changingPasswordDto: ChangingPasswordDto): Promise<void> {
    return await this.userService.changePassword(request.user, changingPasswordDto);
  }

  @Patch('noFirstLogin')
  @ApiOperation({ title: 'Change firstLogin property on false' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async noFirstLogin(@Req() request): Promise<void> {
    return await this.userService.noFirstLogin(request.user);
  }

  @Post('clearProgress')
  @ApiOperation({ title: 'Clear all progress' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async clearProgress(@Req() request): Promise<void> {
    return await this.userService.clearProgress(request.user);
  }

  @Patch('recalculate-trening')
  @ApiOperation({ title: 'Recalculate BMI and Trening Plan' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async recalculateBMIandTreningPlan(@Body() recalculateTrening: RecalculateTrening, @Req() request): Promise<void> {
    return await this.userService.recalculateBMIandTreningPlan(recalculateTrening, request.user);
  }
}
