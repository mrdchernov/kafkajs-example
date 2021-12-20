import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from '@testing/kafka/src/kafka.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config] }),
    KafkaModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('kafka'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
