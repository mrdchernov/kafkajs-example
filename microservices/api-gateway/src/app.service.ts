import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { KafkaService } from '@testing/kafka/dist/kafka.service';

@Injectable()
export class AppService {
  constructor(private service: KafkaService) {
    service.subscribeToResponseOf('test-topic', this.getHello.bind(this));
  }

  async getHello(): Promise<unknown> {
    const res = await this.service.sendMessage('test-topic', { test: true });
    return res;
  }
}
