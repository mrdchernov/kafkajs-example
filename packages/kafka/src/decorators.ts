import { SUBSCRIPTIONS_METADATA } from './util/type';

export function UseSubscribe({ isApi } = { isApi: false }) {
  return function <T extends { new (...args: any[]): any }>(constructor: T) {
    return class extends constructor {
      constructor(...args) {
        super(...args);

        const subscriptionsMetadata = Reflect.getMetadata(
          SUBSCRIPTIONS_METADATA,
          constructor.prototype,
        );

        for (const { topic, handler } of subscriptionsMetadata) {
          if (isApi) {
            this.kafkaService.subscribeToResponseOf(topic, handler.bind(this));
          } else {
            this.kafkaService.subscribe(topic, handler.bind(this));
          }
        }
      }
    };
  };
}

export function Subscribe(topic: string) {
  return function (
    target: any,
    key: PropertyKey,
    descriptor: PropertyDescriptor,
  ) {
    const metadata = Reflect.getMetadata(SUBSCRIPTIONS_METADATA, target) || [];

    console.log('meta while subing -> ', metadata);

    Reflect.defineMetadata(
      SUBSCRIPTIONS_METADATA,
      [
        ...metadata,
        {
          topic: topic,
          handler: descriptor.value,
        },
      ],
      target,
    );
    console.log(target, target.kafkaService, descriptor.value);

    return {
      ...descriptor,
    };
  };
}
