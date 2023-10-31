import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { PiTicketEntity } from "../common/entities/pi_ticket.entity";
import { DB_CONNECTION_NAME } from "../common/constants/db.contants";
import { IsNull, Not, Repository } from "typeorm";
import { PI_CALCULATION_CHUNK_SIZE } from "../common/constants/config.contants";
import { PiTicketCompletedDto } from "./dto/pi-ticket-completed.dto";
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
            where: { id: Not(IsNull()) },
            order: { toIteration: "DESC" }
        });

        const latestIteration = prev ? prev.toIteration : 2;

        const iteration = await this.piTicketRepo.upsert({
            fromIteration: latestIteration,
            toIteration: latestIteration + PI_CALCULATION_CHUNK_SIZE
        }, { conflictPaths: ['fromIteration', 'toIteration'] });


        return iteration.generatedMaps.pop();
    }

    async updateTicketResult({ id, result }: PiTicketCompletedDto) {
        return this.piTicketRepo.update(
            { id },
            { result });
    }

    async aggregatePi() {
        const piDecimal = await this.piDecimalRepo.findOne({
            where: { id: Not(IsNull()) },
            order: { iteration: "DESC" }
        });

        const COMPUTE_SIZE = 100;
        const currentIteration = Number(piDecimal?.iteration ?? 2);

        const qb = this.piTicketRepo.createQueryBuilder('ticket');
        qb.where('ticket.to_iteration > :currentIteration', { currentIteration })
        qb.orderBy('to_iteration')
        qb.take(COMPUTE_SIZE);
        const tickets = await qb.getMany();

        let pi = piDecimal?.result ?? '3';
        let iteration = currentIteration;
        const unResulted = tickets.findIndex(t => !t.result);
        const toAggregates = tickets.slice(0, unResulted);

        for (const ticket of toAggregates) {
            const result = ticket.result;
            pi = new Decimal(pi).plus(result).toString()
            iteration = ticket.toIteration;
        }

        if (iteration !== currentIteration) {
            const newPi = this.piDecimalRepo.create({
                iteration,
                result: pi
            })

            await this.piDecimalRepo.save(newPi);
        }

        const hasNextResulted = tickets
            .slice(unResulted)
            .some(t => t.result);

        return hasNextResulted && tickets[unResulted];
    }
}
