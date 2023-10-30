import { IsString } from "class-validator";
import { ComputePiDto } from "../../pi/dto/compute-pi.dto";

export class PiTicketCompletedDto extends ComputePiDto {
    @IsString()
    result!: string;
}