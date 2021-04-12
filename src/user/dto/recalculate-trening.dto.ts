import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Job } from '../../enums/job';

export class RecalculateTrening {

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
