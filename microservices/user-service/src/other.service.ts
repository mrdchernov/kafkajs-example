import { Injectable } from '@nestjs/common';
import { KafkaService, Subscribe, UseSubscribe } from '@testing/kafka';

@Injectable()
@UseSubscribe({ isApi: true })
export class OtherService {
  constructor(private kafkaService: KafkaService) {}

  @Subscribe('other-topic')
  callOther() {
    return this.kafkaService.sendMessage('other-topic', { test: false });
  }
}
