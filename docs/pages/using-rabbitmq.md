# Using RabbitMQ

To enable rabbitmq support for event streams you just have to use
the type **amqp** on the SequelizeEventStream Constructor.

This module uses [amqplib](https://www.npmjs.com/package/amqplib) as the rabbitmq library of choice.

## Queue architecture

## Required configuration

The required configuration is the same used in amqplib, you can check [here](http://www.squaremobius.net/amqp.node/channel_api.html#connect) the configuration parameters. 

However the minimum parameters to get the rabbitmq producer to work is:
 
 connectURI.protocol
 connectURI.port
 connectURI.hostname
 connectURI.username
 connectURI.password
 connectURI.vhost

 ## Example initialization

```javascript
const SequelizeEventStream = require('sequelize-event-stream');

const configuration = {
  type: 'amqp',
  options: {
    exchange: 'sequelize-event-stream',
    connectURI: {
      protocol: 'amqp',
      port: 5672,
      hostname: '127.0.0.1',
      username: 'rmqadmin',
      password: 'casa1234',
      vhost: '/'
    }
  }
};

const eventStream = new SequelizeEventStream(configuration);

eventStream.attach(sequelize);
```

## Consume the messages

To check the consumes messages just create a consumer as the following example:

```javascript
  const exchange = 'sequelize-event-stream';
  const connectionOpts = {
    protocol: 'amqp',
    port: 5672,
    hostname: '127.0.0.1',
    username: 'rmqadmin',
    password: 'casa1234',
    vhost: '/'
  };
  const connection = await AMQP.connect(connectionOpts);
  const channel = await connection.createChannel();
  //create a exclusive queue with a random generated name for the consumer exclusively
  const response = await channel.assertQueue('', { exclusive: true });
  // its binds the queue to the exchange to basically fetch a copy of every message published
  channel.bindQueue(response.queue, exchange, '#');

  channel.consume(
    response.queue,
    msg => {
      let { event_id, event_name, event_model, event_timestamp } = JSON.parse(msg.content.toString());
      //prints out a table with the event metadata
      console.table({ event_id, event_name, event_model, event_timestamp });
    },
    { noAck: true }
  );

  ```