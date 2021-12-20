export default () => ({
  service: {
    port: process.env.SERVICE_PORT,
  },
  // for api gateway we need separate groupId and clientId for each for example 1: { clientId: 'test-1', groupId: 'groupId-1' }, 2: { clientId: 'test-2', groupId: 'groupId-2' }
  kafka: {
    client: {
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: process.env.KAFKA_BROKERS.split(','),
    },
    consumer: {
      groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
    },
    isApi: true,
    timeout: 5000,
  },
});
