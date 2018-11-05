const AMQP = require('amqplib');
const workerOpts = require('../config').amqp;

(async function consumeMessages() {
  const { exchange, connectURI } = workerOpts;
  const connection = await AMQP.connect(connectURI);
  const channel = await connection.createChannel();
  const response = await channel.assertQueue('', { exclusive: true });

  channel.bindQueue(response.queue, exchange, '#');

  channel.consume(
    response.queue,
    msg => {
      let { event_id, event_name, event_model, event_timestamp } = JSON.parse(msg.content.toString());
      console.table({ event_id, event_name, event_model, event_timestamp });
    },
    { noAck: true }
  );
})();
