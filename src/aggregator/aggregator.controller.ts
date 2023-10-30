import { Controller, Inject, Logger } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { ClientProxy, EventPattern } from "@nestjs/microservices";
import { PiTicketCompletedDto } from "./dto/pi-ticket-completed.dto";

@Controller()
export class AggregatorController {
    private readonly logger = new Logger(AggregatorController.name)

    constructor(private readonly aggregatorService: AggregatorService,
                @Inject('AGGREGATOR_SERVICE') private readonly client: ClientProxy) {
    }

    @EventPattern('pi.compute_idle')
    async distributePiTicket() {
        const ticket = await this.aggregatorService.registerTicket();
        this.client.emit('pi.pi_ticket_available', ticket);
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

        await this.aggregatorService.updatePiDecimal({
            iteration: dto.toIteration,
            decimal: dto.result
        })
    }
}
