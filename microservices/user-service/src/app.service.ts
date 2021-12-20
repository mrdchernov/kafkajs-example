import { Injectable } from '@nestjs/common';
import { KafkaService } from '@testing/kafka/dist/kafka.service';

@Injectable()
export class AppService {
  constructor(private kafka: KafkaService) {
    kafka.subscribe('test-topic', this.getHello.bind(this));
  }

  getHello() {
    return { user: 'some', id: 123321, is_test: false, time: new Date() };
  }
}
