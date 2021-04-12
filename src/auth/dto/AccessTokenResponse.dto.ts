export class AccessTokenResponseDto {
  constructor(model: Partial<AccessTokenResponseDto>) {
    Object.assign(this, model);
  }

  expiresIn: number;
  accessToken: string;
}
