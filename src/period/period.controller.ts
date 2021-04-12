import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PeriodService } from './period.service';
import { CreatePeriodDto } from './dto/create-period.dto';

@Controller('period')
@ApiUseTags('period')
export class PeriodController {
  constructor(private readonly periodService: PeriodService) { }

  @Post('addPeriod')
  @ApiOperation({ title: 'Add period for date' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async addPeriod(@Req() request, @Body() createPeriodDto: CreatePeriodDto): Promise<void> {
    return await this.periodService.addPeriodDate(request.user, createPeriodDto);
  }
}
