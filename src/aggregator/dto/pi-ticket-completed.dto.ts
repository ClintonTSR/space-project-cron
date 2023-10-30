import { IsString, IsUUID } from "class-validator";
import { ComputePiDto } from "../../pi/dto/compute-pi.dto";

export class PiTicketCompletedDto extends ComputePiDto {
    @IsUUID()
    id!: string;

    @IsString()
    result!: string;
}