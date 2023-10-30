import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { PiTicketEntity } from "../common/entities/pi_ticket.entity";
import { DB_CONNECTION_NAME } from "../common/constants/db.contants";
import Decimal from "decimal.js";
import { PI_NUMERATOR } from "../common/constants/config.contants";
import { ComputePiDto } from "./dto/compute-pi.dto";

@Injectable()
export class PiService {
    @InjectRepository(PiTicketEntity, DB_CONNECTION_NAME)
    private readonly logger = new Logger(PiService.name);

    computePiDecimal({ fromIteration, toIteration }: ComputePiDto) {
        const startAt = new Decimal(fromIteration);
        const endAt = new Decimal(toIteration);
        let sign = startAt.mod(4).eq(0) ? -1 : 1;
        let accumulator = new Decimal(0);

        for (let n = startAt; n.lessThan(endAt); n = n.plus(2)) {
            const denominator = n.times(n.plus(1)).times(n.plus(2));
            const decimal = PI_NUMERATOR.div(denominator);
            accumulator = accumulator.plus(decimal.times(sign));
            sign *= -1;
        }

        return accumulator
    }
}
