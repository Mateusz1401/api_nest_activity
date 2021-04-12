import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateQuestDto {
    @ApiModelProperty()
    @IsNotEmpty()
    readonly questDate: string;

    @ApiModelProperty()
    @IsNotEmpty()
    readonly distance: string;
}
