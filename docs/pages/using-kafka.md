# Using Apache Kafka

To enable kafka support for event streams you just have to use
the type **kafka** on the SequelizeEventStream Constructor.

This module uses [kafka-node](https://www.npmjs.com/package/kafka-node) as the kafka library of choice, also the producer implemented is the high level producer.

## Topics

The following list contains the topics used by the kafka publisher

topic|description
---|---
created| Created model instances
updated| Updated model instances
destroyed| Destroyed model instances
bulk-created| Bulk created model instances
bulk-destroyed| Bulk destroyed model instances 
bulk-updated| Bulk updated model instances

## Required configuration

The required configuration is the same used in KafkaClient, you can check [here](https://www.npmjs.com/package/kafka-node#kafkaclient) the configuration parameters. 

However the minimum parameters to get the kafka producer to work is **kafkaHost**.

## Example initialization

```javascript
const SequelizeEventStream = require('sequelize-event-stream');

const configuration = {
  type: 'kafka',
  options: {
    kafkaHost: '127.0.0.1:9092'
  }
};

const eventStream = new SequelizeEventStream(configuration);

eventStream.attach(sequelize);
```

## Consume the messages

To check the consumes messages just create a HigLevelConsumer and connect to the desired topics, in the following example we connect to the created, updated an destroyed topics at the same time

```javascript
  
  const { HighLevelConsumer, KafkaClient } = require('kafka-node');
  
  const kafkaHost = '127.0.0.1:9092';
  const client = KafkaClient({ kafkaHost });
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
```