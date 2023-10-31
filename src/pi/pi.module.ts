import { Module } from '@nestjs/common';
import { PiService } from './pi.service';
import { PiController } from './pi.controller';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: "PI_SERVICE",
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
            }
        ])],
    providers: [PiService],
    controllers: [PiController],
})
export class PiModule {
}
