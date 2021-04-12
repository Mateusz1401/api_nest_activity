import { ApiModelProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  constructor(model: Partial<RefreshTokenDto>) {
    Object.assign(this, model);
  }
  @ApiModelProperty()
  refreshToken: string;
}
