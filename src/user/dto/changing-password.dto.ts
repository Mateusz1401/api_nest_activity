import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangingPasswordDto {
  @ApiModelProperty()
  @IsNotEmpty()
  readonly oldPassword: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly password: string;
}
