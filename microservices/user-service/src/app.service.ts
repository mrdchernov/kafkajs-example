import { Injectable } from '@nestjs/common';
import { Subscribe, UseSubscribe, KafkaService } from '@testing/kafka';

@Injectable()
@UseSubscribe()
export class AppService {
  constructor(private kafkaService: KafkaService) {}

  @Subscribe('test-topic')
  getHello() {
    return { user: 'some', id: 123321, is_test: false, time: new Date() };
  }
}
