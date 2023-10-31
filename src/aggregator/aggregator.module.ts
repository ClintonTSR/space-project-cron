import { Module } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { AggregatorController } from './aggregator.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PiTicketEntity } from "../common/entities/pi_ticket.entity";
import { DB_CONNECTION_NAME } from "../common/constants/db.contants";
import { PiDecimalEntity } from "../common/entities/pi_decimal.entity";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [PiTicketEntity, PiDecimalEntity],
            DB_CONNECTION_NAME),
        ClientsModule.registerAsync([
            {
                name: "AGGREGATOR_SERVICE",
                inject: [ConfigService],
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get<string>('RMQ_URL')],
                        queue: 'pi-result',
                        queueOptions: {
                            durable: false
                        }
                    }
                }),
            }]
        )],
    controllers: [AggregatorController],
    providers: [AggregatorService],
    exports: [AggregatorService]
})
export class AggregatorModule {
}
