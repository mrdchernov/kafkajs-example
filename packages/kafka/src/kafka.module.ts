import { DynamicModule, Global, Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Global()
@Module({})
export class KafkaModule {
  static registerAsync(kafkaOptions): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        KafkaService,
        {
          provide: 'KafkaConfig',
          useFactory: kafkaOptions.useFactory,
          inject: kafkaOptions.inject || [],
        },
      ],
      exports: [KafkaService],
    };
  }
}
