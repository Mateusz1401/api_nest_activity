import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailerProvider } from '@nest-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigKey } from '../config/config-key';
import { ConfigService } from '../config/config.service';
import { ResetPasswordDto } from '../email/dto/reset-password.dto';
import { ResetPasswordEmailDto } from './dto/reset-password-email.dto';
import { User } from '../database/entities/user.entity';

const configService = new ConfigService();

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject('MailerProvider')
    private readonly mailerProvider: MailerProvider,
  ) { }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const foundUser = await this.userRepository.findOne({ email: resetPasswordDto.email });

    if (!foundUser) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    if (foundUser.resetCode !== resetPasswordDto.resetCode) {
      throw new HttpException('Reset code is wrong', HttpStatus.BAD_REQUEST);
    }

    const updatedUser = { ...foundUser, resetCode: null, password: bcrypt.hashSync(resetPasswordDto.newPassword, 10) };

    await this.userRepository.update(foundUser.id, updatedUser);
  }

  async sendResetPasswordEmail(resetPasswordEmailDto: ResetPasswordEmailDto): Promise<void> {
    const foundUser = await this.userRepository.findOne({ email: resetPasswordEmailDto.email });

    if (!foundUser) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    const newResetCode = crypto.randomBytes(7).toString('hex');

    const updatedUser = { ...foundUser, resetCode: newResetCode };

    await this.userRepository.update(foundUser.id, updatedUser);

    switch (resetPasswordEmailDto.appLanguage) {
      case 'EN':
        return await this.mailerProvider.sendMail({
          to: resetPasswordEmailDto.email,
          from: configService.get(ConfigKey.EMAIL_FROM),
          subject: 'Reset user\'s password ✔',
          template: 'reset-password-en',
          context: {
            username: foundUser.firstName,
            hashCode: newResetCode,
          },
        });
      case 'PL':
        return await this.mailerProvider.sendMail({
          to: resetPasswordEmailDto.email,
          from: configService.get(ConfigKey.EMAIL_FROM),
          subject: 'Resetowanie hasła ✔',
          template: 'reset-password-pl',
          context: {
            username: foundUser.firstName,
            hashCode: newResetCode,
          },
        });
      default:
        return await this.mailerProvider.sendMail({
          to: resetPasswordEmailDto.email,
          from: configService.get(ConfigKey.EMAIL_FROM),
          subject: 'Reset user\'s password ✔',
          template: 'reset-password-en',
          context: {
            username: foundUser.firstName,
            hashCode: newResetCode,
          },
        });
    }
  }
}
