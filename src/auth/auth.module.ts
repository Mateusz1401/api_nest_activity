import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { RefreshToken } from '../database/entities/refreshToken.entity';
import { ConfigKey } from '../config/config-key';
import { ConfigService } from '../config/config.service';
import { User } from '../database/entities/user.entity';

const configService = new ConfigService();

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: configService.get(ConfigKey.SECRET_KEY),
      signOptions: {
        expiresIn: configService.get(ConfigKey.EXPIRES_IN),
      },
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
