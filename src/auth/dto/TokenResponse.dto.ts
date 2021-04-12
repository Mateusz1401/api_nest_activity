export class TokenResponseDto {
  constructor(model: Partial<TokenResponseDto>) {
    Object.assign(this, model);
  }

  expiresIn: number;
  accessToken: string;
  refreshToken: string;
}
