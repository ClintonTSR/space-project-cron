import { Module } from '@nestjs/common';
import { PiService } from './pi.service';
import { PiController } from './pi.controller';
import { AggregatorModule } from "../aggregator/aggregator.module";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [
        AggregatorModule,
        ClientsModule.register([
            {
                name: "PI_SERVICE",
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5672'],
                    queue: 'pi-result',
                    queueOptions: {
                        durable: false
                    }
                }
            }
        ])],
    providers: [PiService],
    controllers: [PiController],
})
export class PiModule {
}
