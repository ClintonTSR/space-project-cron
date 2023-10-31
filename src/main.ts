import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import Decimal from "decimal.js";
import { DECIMAL_PRECISION } from "./common/constants/config.contants";

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.RMQ,
        options: {
            urls: [process.env.RMQ_URL!],
            queue: 'pi-result',
            queueOptions: {
                durable: false
            }
        }
    });

    Decimal.config({ precision: DECIMAL_PRECISION })
    await app.listen();
}

bootstrap();
