import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SendChallengeDto {
    @ApiModelProperty()
    @IsNotEmpty()
    readonly emailTo: string;

    @ApiModelProperty()
    @IsNotEmpty()
    readonly challengeDate: string;

    @ApiModelProperty()
    @IsNotEmpty()
    readonly distance: string;
}
