const { HighLevelConsumer, KafkaClient } = require('kafka-node');
const { kafka } = require('../config');

(async function consumeMessages() {
  const client = KafkaClient(kafka);
  const consumer = new HighLevelConsumer(
    client,
    [
      { topic: 'created' },
      { topic: 'updated' },
      { topic: 'destroyed' }
    ],
    {
      groupId: 'event-stream-consumer'
    }
  );

  consumer.on('message', message => {
    console.log(message);
  });
})();
