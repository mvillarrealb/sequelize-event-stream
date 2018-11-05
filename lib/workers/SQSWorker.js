const AWS = require('aws-sdk');
const EventWorker = require('./EventWorker');

class SQSWorker extends EventWorker {
  /**
   *
   * @param {} eventData
   */
  publish(eventData) {
    super.publish(eventData);
    const { QueueUrl } = this.config;
    const { event_id, event_name, event_timestamp, event_model, event_body } = eventData;
    const message = {
      MessageAttributes: {
        event_id: {
          DataType: 'String',
          StringValue: event_id
        },
        event_name: {
          DataType: 'String',
          StringValue: event_name
        },
        event_timestamp: {
          DataType: 'String',
          StringValue: event_timestamp
        },
        event_model: {
          DataType: 'String',
          StringValue: event_model
        }
      },
      MessageBody: event_body,
      QueueUrl
    };
    this.getSQS().sendMessage(message);
  }

  getSQS() {
    if (this.sqs === null) {
      const { apiVersion, region } = this.config;
      AWS.config.update({ region });
      this.sqs = new AWS.SQS({ apiVersion });
    }
    return this.sqs;
  }
}

module.exports = SQSWorker;
