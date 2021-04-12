import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiModelProperty()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly birthDate: string;

  @ApiModelProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
