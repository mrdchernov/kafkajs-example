import { Injectable } from '@nestjs/common';
import { KafkaService, Subscribe, UseSubscribe } from '@testing/kafka';

@Injectable()
@UseSubscribe({ isApi: true })
export class AppService {
  constructor(private kafkaService: KafkaService) {}

  @Subscribe('test-topic')
  async getHello(): Promise<unknown> {
    const res = await this.kafkaService.sendMessage('test-topic', {
      test: true,
    });
    return res;
  }

  @Subscribe('other-topic')
  getInfo() {
    return this.kafkaService.sendMessage('other-topic', {
      info: 'asd',
    });
  }
}
