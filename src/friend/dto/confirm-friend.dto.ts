import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ConfirmFriendDto {

  @ApiModelProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
