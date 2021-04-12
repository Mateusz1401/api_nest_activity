import { Controller, Body, Post } from '@nestjs/common';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { RefreshTokenDto } from './dto/RefreshToken.dto';
import { AccessTokenResponseDto } from './dto/AccessTokenResponse.dto';
import { TokenResponseDto } from './dto/TokenResponse.dto';

@Controller('auth')
@ApiUseTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiOperation({ title: 'Log in' })
  async login(@Body() loginUserDto: LoginUserDto): Promise<TokenResponseDto> {
    return await this.authService.login(loginUserDto);
  }

  @Post('token')
  @ApiOperation({ title: 'Get token by refresh token' })
  async token(@Body() refreshTokenDto: RefreshTokenDto): Promise<AccessTokenResponseDto> {
    return await this.authService.token(refreshTokenDto);
  }
}
