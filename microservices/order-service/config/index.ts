export default () => ({
  kafka: {
    client: {
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: process.env.KAFKA_BROKERS.split(','),
    },
    consumer: {
      groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
    },
  },
});
