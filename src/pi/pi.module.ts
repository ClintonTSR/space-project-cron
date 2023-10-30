import { Module } from '@nestjs/common';
import { PiService } from './pi.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { DB_CONNECTION_NAME } from "../common/constants/db.contants";
import { PiTicketEntity } from "../common/entities/pi_ticket.entity";
import { PiController } from './pi.controller';
import { AggregatorModule } from "../aggregator/aggregator.module";

@Module({
    imports: [TypeOrmModule.forFeature([PiTicketEntity], DB_CONNECTION_NAME), AggregatorModule],
    providers: [PiService],
    controllers: [PiController],
})
export class PiModule {
}
