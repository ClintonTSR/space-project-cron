import { IsNotEmpty, IsNumber } from "class-validator";

export class ComputePiDto {
    @IsNumber()
    @IsNotEmpty()
    fromIteration!: number;

    @IsNumber()
    @IsNotEmpty()
    toIteration!: number;
}