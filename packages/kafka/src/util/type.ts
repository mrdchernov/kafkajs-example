import { ConsumerConfig, KafkaConfig } from 'kafkajs';

export type kafkaConfig = {
  client: KafkaConfig;
  consumer: ConsumerConfig;
  isApi: boolean;
  timeout: number;
};

export type kafkaSubscription = {
  handler: (unknown) => unknown;
  replyTopic?: string;
};
