import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { KafkaModule } from '@testing/kafka';
import config from '../config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    KafkaModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('konfig', configService.get('kafka'));
        return configService.get('kafka');
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
