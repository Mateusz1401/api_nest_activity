import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MarkDoneQuestDto {
    @ApiModelProperty()
    @IsNotEmpty()
    readonly id: string;
}
