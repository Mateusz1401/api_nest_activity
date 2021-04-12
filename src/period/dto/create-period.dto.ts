import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePeriodDto {
  @ApiModelProperty()
  @IsNotEmpty()
  readonly calendarDate: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly distance: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly calories: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly averageSpeed: string;
}
