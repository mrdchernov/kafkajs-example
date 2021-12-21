import { Injectable } from '@nestjs/common';
import { KafkaService, Subscribe, UseSubscribe } from '@testing/kafka';

@Injectable()
@UseSubscribe()
export class AppService {
  constructor(private kafkaService: KafkaService) {}

  @Subscribe('other-topic')
  getHello() {
    return { data: new Date() };
  }
}
