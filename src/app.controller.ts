import { Get, Controller } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/test')
  @ApiOperation({ title: 'Testing endpoint' })
  root(): string {
    return this.appService.root();
  }
}
