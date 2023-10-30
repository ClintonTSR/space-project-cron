import { Module } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { AggregatorController } from './aggregator.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PiTicketEntity } from "../common/entities/pi_ticket.entity";
import { DB_CONNECTION_NAME } from "../common/constants/db.contants";
import { PiDecimalEntity } from "../common/entities/pi_decimal.entity";

@Module({
    imports: [TypeOrmModule.forFeature([PiTicketEntity, PiDecimalEntity], DB_CONNECTION_NAME)],
    controllers: [AggregatorController],
    providers: [AggregatorService],
})
export class AggregatorModule {
}
