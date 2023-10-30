import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class ComputePiDto {
    @IsUUID()
    id!: string;

    @IsNumber()
    @IsNotEmpty()
    fromIteration!: number;

    @IsNumber()
    @IsNotEmpty()
    toIteration!: number;
}