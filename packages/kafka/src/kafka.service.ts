import { Inject, Injectable } from '@nestjs/common';
import { kafkaConfig, kafkaSubscription } from './util/type';
import { Admin, Consumer, Kafka, Producer } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';

const DEFAULT_PARTITION_AMOUNT = 10;

@Injectable()
export class KafkaService {
  private kafka: Kafka;
  private admin: Admin;
  private consumer: Consumer;
  private producer: Producer;
  private readonly timeout: number;
  private eventListener: EventEmitter;
  private readonly useSlug: boolean;
  private readonly postfix: string;

  private topics: Map<string, kafkaSubscription> = new Map();

  constructor(@Inject('KafkaConfig') options: kafkaConfig) {
    const client = options.client;
    this.timeout = options.timeout;
    this.postfix = uuidv4().toString();
    console.log('postfix', this.postfix);
    this.useSlug = options.isApi;
    this.kafka = new Kafka({
      ...client,
    });
    this.eventListener = new EventEmitter();

    this.admin = this.kafka.admin();
    this.consumer = this.kafka.consumer({ groupId: options.consumer.groupId });
    this.producer = this.kafka.producer({ allowAutoTopicCreation: false });
  }

  public subscribe(topicName: string, handler: (unknown) => unknown) {
    this.topics.set(topicName, { handler, replyTopic: topicName });
  }

  public async onModuleInit() {
    await this.consumer.connect();
    await this.producer.connect();
    await this.admin.connect();
    for (const [topic, { replyTopic }] of this.topics) {
      // if they are different - we are expecting response to come to the our own response topic with slug
      let subTopic = topic;
      if (replyTopic && topic !== replyTopic) {
        subTopic = replyTopic;
      }
      await this.admin.createTopics({
        topics: [{ topic: subTopic, numPartitions: DEFAULT_PARTITION_AMOUNT }],
      });
      await this.consumer.subscribe({
        topic: subTopic,
        fromBeginning: false,
      });
    }

    await this.run();
  }

  async onModuleDestroy() {
    const toRemove = [];
    for (const [topic, { replyTopic }] of this.topics) {
      // if they are different - we will remove unique topics for our api services
      if (replyTopic && topic !== replyTopic) {
        toRemove.push(replyTopic);
      }
    }
    console.log('remove topics', toRemove);
    await this.admin.deleteTopics({ topics: toRemove });
  }

  public sendMessage(
    topic,
    value,
    { reply, id: resId }: { reply: boolean; id: string } = {
      reply: false,
      id: undefined,
    },
  ) {
    return new Promise<unknown>(async (resolve, reject) => {
      const sub = this.topics.get(topic);

      const id = resId || uuidv4().toString();
      if (!reply) {
        this.eventListener.addListener(id, (data) => {
          console.log('resolved item', data);

          resolve(new Buffer(data).toString());
        });
      }

      await this.producer.send({
        topic: topic,
        messages: [
          {
            value: JSON.stringify(value),
            headers: {
              ...(reply && { reply: 'true' }),
              reqId: id,
              ...(sub?.replyTopic && { replyTopic: sub.replyTopic }),
            },
          },
        ],
      });
      if (reply) {
        resolve(true);
      } else {
        setTimeout(() => reject(new Error('Timeout')), this.timeout);
      }
    });
  }

  public async subscribeToResponseOf(topic, handler) {
    const replyTopic = topic + this.postfix;

    this.topics.set(topic, { handler, replyTopic: replyTopic });
  }

  private async run() {
    await this.consumer.run({
      eachMessage: this.processMessage.bind(this),
    });
  }

  private async processMessage({ topic, partition, message }) {
    // --logging
    const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
    console.log(
      `- ${prefix} ${message.key}#${JSON.stringify(message.headers)}`,
    );
    // --end logging
    const id = new Buffer(message.headers.reqId).toString();
    let replyTopic = message.headers.replyTopic;
    if (replyTopic) {
      replyTopic = new Buffer(message.headers.replyTopic).toString();
    }
    console.log('reply topic === > ', replyTopic, id);
    const sub = this.topics.get(topic);
    if (message.headers.reply) {
      this.eventListener.emit(id, message.value);
      return;
    }
    let res, err;
    try {
      res = await sub.handler(message);
    } catch (e) {
      err = e.message;
    }
    await this.sendMessage(
      replyTopic,
      { data: res, error: err },
      {
        reply: true,
        id: id,
      },
    );
  }
}
