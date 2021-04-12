import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MarkDoneAchievementDto {
    @ApiModelProperty()
    @IsNotEmpty()
    readonly id: string;
}
