import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { PiTicketEntity } from "../common/entities/pi_ticket.entity";
import { DB_CONNECTION_NAME } from "../common/constants/db.contants";
import { IsNull, Not, Repository } from "typeorm";
import { PI_CALCULATION_CHUNK_SIZE } from "../common/constants/config.contants";
import { PiTicketCompletedDto } from "./dto/pi-ticket-completed.dto";
import { UpdatePiDecimalDto } from "./dto/update-pi-decimal.dto";
import { PiDecimalEntity } from "../common/entities/pi_decimal.entity";
import Decimal from "decimal.js";

@Injectable()
export class AggregatorService {
    private readonly logger = new Logger(AggregatorService.name)

    constructor(@InjectRepository(PiTicketEntity, DB_CONNECTION_NAME)
                private piTicketRepo: Repository<PiTicketEntity>,
                @InjectRepository(PiDecimalEntity, DB_CONNECTION_NAME)
                private piDecimalRepo: Repository<PiDecimalEntity>,
    ) {
    }

    async registerTicket() {
        const prev = await this.piTicketRepo.findOne({
            where: { createdAt: Not(IsNull()) },
            order: { toIteration: "DESC" }
        });

        const latestIteration = prev ? prev.toIteration : 2;

        const iteration = this.piTicketRepo.create({
            fromIteration: latestIteration,
            toIteration: latestIteration + PI_CALCULATION_CHUNK_SIZE
        });

        return this.piTicketRepo.save(iteration);
    }

    async updateTicketResult({ id, result }: PiTicketCompletedDto) {
        return this.piTicketRepo.update(
            { id },
            { result });
    }

    async updatePiDecimal({ iteration, decimal }: UpdatePiDecimalDto) {
        const piDecimal = await this.piDecimalRepo.findOne({
            where: { id: Not(IsNull()) },
            order: { iteration: "DESC" }
        });

        const pi = new Decimal(piDecimal?.result ?? 3);
        const updatedPi = pi.plus(new Decimal(decimal))
        const newIteration = this.piDecimalRepo.create({
            iteration,
            result: updatedPi.toString()
        })

        return this.piDecimalRepo.save(newIteration);
        //
        // const truncatedPi = pi.toDecimalPlaces(digitCount, Decimal.ROUND_DOWN);
        //
        // if (truncatedPi.toString() !== stagedPi.toString()) {
        //     stagedPi = truncatedPi
        // } else {
        //     digitCount += 1;
        //     console.log(truncatedPi)
        // }
    }
}
