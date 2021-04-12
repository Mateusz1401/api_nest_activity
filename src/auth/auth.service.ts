import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { UserService } from '../user/user.service';
import { RefreshToken } from '../database/entities/refreshToken.entity';
import { TokenResponseDto } from './dto/TokenResponse.dto';
import { RefreshTokenDto } from './dto/RefreshToken.dto';
import { AccessTokenResponseDto } from './dto/AccessTokenResponse.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { ConfigKey } from '../config/config-key';
import { ConfigService } from '../config/config.service';
import { User } from '../database/entities/user.entity';

const configService = new ConfigService();

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) { }

  async login(loginUserDto: LoginUserDto): Promise<TokenResponseDto> {
    const foundUser = await this.userRepository.findOne({ email: loginUserDto.email });

    if (!foundUser || !bcrypt.compareSync(loginUserDto.password, foundUser.password)) {
      throw new HttpException('Wrong email or password', HttpStatus.BAD_REQUEST);
    }

    const user: JwtPayload = { email: foundUser.email, id: foundUser.id };
    const accessToken = this.jwtService.sign(user);
    const refreshToken = crypto.randomBytes(35).toString('hex');
    const refreshTokenModel = new RefreshToken({ value: refreshToken });
    foundUser.refreshToken = refreshTokenModel;

    await this.userRepository.save(foundUser);

    return new TokenResponseDto({
      expiresIn: configService.get(ConfigKey.EXPIRES_IN),
      accessToken,
      refreshToken,
    });
  }

  async token(refreshTokenDto: RefreshTokenDto): Promise<AccessTokenResponseDto> {
    const refreshTokenModel = await this.refreshTokenRepository
      .createQueryBuilder('refreshToken')
      .select(['refreshToken'])
      .where('value = :value', { value: refreshTokenDto.refreshToken })
      .leftJoinAndSelect('refreshToken.user', 'user')
      .getOne();

    if (!refreshTokenModel || !this.isTokenActual(refreshTokenModel.expirionIn)) {
      throw new BadRequestException();
    }

    const user: JwtPayload = { email: refreshTokenModel.user.email, id: refreshTokenModel.user.id };
    const generatedAccessToken = this.jwtService.sign(user);

    return new AccessTokenResponseDto({ accessToken: generatedAccessToken, expiresIn: configService.get(ConfigKey.EXPIRES_IN) });
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    return await this.userRepository.findOne({ id: payload.id, email: payload.email });
  }

  private isTokenActual(isExpiredOn: Date): boolean {
    const expiration = new Date();
    expiration.setSeconds(
      isExpiredOn.getSeconds() + configService.get(ConfigKey.REFRESH_TOKEN_EXPIRATION),
    );

    return expiration > new Date();
  }
}
