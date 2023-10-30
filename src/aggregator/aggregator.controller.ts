import { Controller, Logger } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { EventPattern } from "@nestjs/microservices";
import { PiTicketCompletedDto } from "./dto/pi-ticket-completed.dto";

@Controller()
export class AggregatorController {
    constructor(private readonly aggregatorService: AggregatorService,
                private readonly logger = new Logger(AggregatorController.name)) {
    }

    @EventPattern('pi.compute_completed')
    async onPiTicketCompleted(dto: PiTicketCompletedDto) {
        const updated = await this.aggregatorService.updateTicketResult(dto);

        if (!updated.affected ?? 0 > 0) {
            return this.logger.error({
                action: '@AggregatorController:onPiTicketCompleted',
                message: "None of the tickets are updated",
            });
        }

        const latestPi = await this.aggregatorService.updatePiDecimal({
            iteration: dto.toIteration,
            decimal: dto.result
        })
    }
}
