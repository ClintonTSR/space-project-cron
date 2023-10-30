import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PiModule } from "./pi/pi.module";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DB_CONNECTION_NAME } from "./common/constants/db.contants";
// import { ProcessorModule } from './processor/processor.module';
import { PiTicketEntity } from "./common/entities/pi_ticket.entity";
import { AggregratorModule } from './aggregrator/aggregrator.module';
import { AggregatorModule } from './aggregator/aggregator.module';

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
                synchronize: configService.get('NODE_ENV') === 'development',
                entities: [PiTicketEntity],

            }),
        }),
        ScheduleModule.forRoot(),
        PiModule,
        AggregratorModule,
        AggregatorModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
