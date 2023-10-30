import { Controller, Inject } from '@nestjs/common';
import { PiService } from "./pi.service";
import { ClientProxy } from "@nestjs/microservices";
import { Timeout } from "@nestjs/schedule";
import { AggregatorService } from "../aggregator/aggregator.service";

@Controller('pi')
export class PiController {
    constructor(
        private piService: PiService,
        private aggregatorService: AggregatorService,
        @Inject('PI_SERVICE') private readonly client: ClientProxy) {
    }

    @Timeout(1000)
    async startCompute() {
        const { id, fromIteration, toIteration } = await this.aggregatorService.registerTicket();

        const result = this.piService.computePiDecimal({
            fromIteration,
            toIteration
        }); //passed from ticket

        this.client.emit('pi.compute_completed', {
            id,
            fromIteration,
            toIteration,
            result,
        });
    }
}
