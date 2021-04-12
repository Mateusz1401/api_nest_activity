import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCalendarDateDto {

  @ApiModelProperty()
  @IsNotEmpty()
  readonly date: string;
}
