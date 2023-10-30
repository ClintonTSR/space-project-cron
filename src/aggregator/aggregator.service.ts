import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { PiTicketEntity } from "../common/entities/pi_ticket.entity";
import { DB_CONNECTION_NAME } from "../common/constants/db.contants";
import { Repository } from "typeorm";
import { PI_CALCULATION_CHUNK_SIZE } from "../common/constants/config.contants";
import { PiTicketCompletedDto } from "./dto/pi-ticket-completed.dto";
import { UpdatePiDecimalDto } from "./dto/update-pi-decimal.dto";
import { PiDecimalEntity } from "../common/entities/pi_decimal.entity";
import Decimal from "decimal.js";

@Injectable()
export class AggregatorService {
    @InjectRepository(PiTicketEntity, DB_CONNECTION_NAME)
    private piTicketRepo: Repository<PiTicketEntity>
    private piDecimalRepo: Repository<PiDecimalEntity>
    private readonly logger = new Logger(AggregatorService.name);

    async registerTicket() {
        const latestIteration = await this.piTicketRepo.maximum('toIteration');
        return this.piTicketRepo.create({
            fromIteration: latestIteration,
            toIteration: latestIteration + PI_CALCULATION_CHUNK_SIZE
        });
    }

    async updateTicketResult({ id, result }: PiTicketCompletedDto) {
        return this.piTicketRepo.update(
            { id },
            { result });
    }

    async updatePiDecimal({ iteration, decimal }: UpdatePiDecimalDto) {
        const latestIteration = await this.piDecimalRepo.maximum('iteration')
        const piDecimal = await this.piDecimalRepo.findOne({ where: { iteration: latestIteration } })
        const pi = new Decimal(piDecimal?.result);
        // count = count.plus(chunkSize)
        const updatedPi = pi.plus(new Decimal(decimal))
        return this.piDecimalRepo.create({
            iteration,
            result: updatedPi.toString()
        })
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
