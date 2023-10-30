import { Controller, Inject } from '@nestjs/common';
import { PiService } from "./pi.service";
import { ClientProxy, EventPattern } from "@nestjs/microservices";
import { Timeout } from "@nestjs/schedule";
import { ComputePiDto } from "./dto/compute-pi.dto";

@Controller('pi')
export class PiController {
    constructor(
        private piService: PiService,
        @Inject('PI_SERVICE') private readonly client: ClientProxy) {
    }

    @Timeout(1000)
    async onStart() {
        this.client.emit('pi.compute_idle', {});
    }

    @EventPattern('pi.pi_ticket_available')
    async starCompute(ticket: ComputePiDto) {
        const { id, fromIteration, toIteration } = ticket;

        const result = this.piService.computePiDecimal({
            id,
            fromIteration,
            toIteration
        }); //passed from ticket

        this.client.emit('pi.compute_completed', {
            id,
            fromIteration,
            toIteration,
            result,
        });

        this.client.emit('pi.compute_idle', {});
    }
}
