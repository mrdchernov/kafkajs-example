export function ResponseToTopic(topic: string) {
  return function (
    target: any,
    key: PropertyKey,
    descriptor: PropertyDescriptor,
  ) {
    async function processCall(...args) {
      const original = descriptor.value;
      console.log(original(...args));
      this.kafka && this.kafka(topic);
    }

    return {
      ...descriptor,
      initializer: undefined,
      value: processCall,
    };
  };
}
