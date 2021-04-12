import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import {Sex} from '../../enums/Sex';
import {Job} from '../../enums/Job';

export class CreateUserDto {
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

  @ApiModelProperty()
  @IsNotEmpty()
  readonly password: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly sex: Sex;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly weight: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly height: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly job: Job;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly activity: number;
}
