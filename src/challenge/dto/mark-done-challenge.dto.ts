import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MarkDoneChallengeDto {
    @ApiModelProperty()
    @IsNotEmpty()
    readonly id: string;
}
