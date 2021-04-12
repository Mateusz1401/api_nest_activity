import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class InviteFriendDto {

  @ApiModelProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly receiverEmail: string;
}
