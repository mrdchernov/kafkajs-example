import { Injectable } from '@nestjs/common';
import { Subscribe, UseSubscribe, KafkaService } from '@testing/kafka';
import { OtherService } from './other.service';

@Injectable()
@UseSubscribe()
export class AppService {
  constructor(
    private kafkaService: KafkaService,
    private otherService: OtherService,
  ) {}

  @Subscribe('test-topic')
  async getHello() {
    const res = await this.otherService.callOther();
    console.log('res');
    return { res, user: 'some', id: 123321, is_test: false, time: new Date() };
  }
}
