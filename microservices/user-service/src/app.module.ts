import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaModule } from '@testing/kafka';
import config from '../config';
import { OtherService } from './other.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    KafkaModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('kafka'),
    }),
  ],
  providers: [AppService, OtherService],
  exports: [OtherService],
})
export class AppModule {}
