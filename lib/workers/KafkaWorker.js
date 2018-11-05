const { HighLevelProducer, KafkaClient } = require('kafka-node');
const EventWorker = require('./EventWorker');
/**
 * KafkaWorker represents a Event dispatch Worker
 * implementing HighLevelProducer Kafka producer to send
 * messages to the configured broker
 *
 * @author Marco Villarreal
 */
class KafkaWorker extends EventWorker {
  constructor(config) {
    super(config);
    this.producer = null;
  }

  publish(eventData) {
    super.publish(eventData);
    const { event_name } = eventData;
    const kafkaMessage = {
      topic: event_name,
      message: JSON.stringify(eventData)
    };
    this.getProducer().send(kafkaMessage);
  }

  getProducer() {
    if (this.producer === null) {
      const client = new KafkaClient();
      this.producer = new HighLevelProducer(client);
    }
    return this.producer;
  }
}

module.exports = KafkaWorker;
