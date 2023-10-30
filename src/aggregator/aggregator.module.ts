import { Module } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { AggregatorController } from './aggregator.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PiTicketEntity } from "../common/entities/pi_ticket.entity";
import { DB_CONNECTION_NAME } from "../common/constants/db.contants";
import { PiDecimalEntity } from "../common/entities/pi_decimal.entity";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [PiTicketEntity, PiDecimalEntity],
            DB_CONNECTION_NAME),
        ClientsModule.register([
            {
                name: "AGGREGATOR_SERVICE",
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5672'],
                    queue: 'pi-result',
                    queueOptions: {
                        durable: false
                    }
                }
            }]
        )],
    controllers: [AggregatorController],
    providers: [AggregatorService],
    exports: [AggregatorService]
})
export class AggregatorModule {
}
