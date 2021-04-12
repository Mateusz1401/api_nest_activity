import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateCalendarDateDto {

  @ApiModelProperty()
  @IsNotEmpty()
  readonly calendarDate: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly distanceTotal: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly caloriesTotal: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly averageSpeedTotal: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly star: boolean;
}
