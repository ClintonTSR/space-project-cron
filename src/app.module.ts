import { Module } from '@nestjs/common';
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DB_CONNECTION_NAME } from "./common/constants/db.contants";
import { PiTicketEntity } from "./common/entities/pi_ticket.entity";
import { AggregatorModule } from "./aggregator/aggregator.module";
import { PiModule } from "./pi/pi.module";
import { PiDecimalEntity } from "./common/entities/pi_decimal.entity";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            imports: [ConfigModule],
            name: DB_CONNECTION_NAME,
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                synchronize: true, //configService.get('NODE_ENV') === 'development',
                entities: [PiTicketEntity, PiDecimalEntity],

            }),
        }),
        ScheduleModule.forRoot(),
        PiModule,
        AggregatorModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
