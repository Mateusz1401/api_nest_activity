import { Controller, Body, Post } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { ResetPasswordEmailDto } from './dto/reset-password-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from './email.service';

@Controller('email')
@ApiUseTags('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService) { }

  @Post('sendResetPasswordEmail')
  @ApiOperation({ title: 'Send email to reset user\'s password' })
  async sendResetPasswordEmail(@Body() resetPasswordEmailDto: ResetPasswordEmailDto): Promise<void> {
    return await this.emailService.sendResetPasswordEmail(resetPasswordEmailDto);
  }

  @Post('resetPassword')
  @ApiOperation({ title: 'Reset user\'s password' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
    return await this.emailService.resetPassword(resetPasswordDto);
  }
}
