const chai = require('chai');
const EventWorkerFactory = require('../../../lib/workers/EventWorkerFactory');
const AMQPWorker = require('../../../lib/workers/AMQPWorker');
const KafkaWorker = require('../../../lib/workers/KafkaWorker');
const SQSWorker = require('../../../lib/workers/SQSWorker');

const { expect } = chai;

describe('#EventWorkerFactory', () => {
  context('Worker creation', () => {
    it('Should create a AMQPWorker', () => {
      const amqpOptions = {
        exchange: 'sequelize-event-stream',
        connectURI: {
          protocol: 'amqp',
          port: 5672,
          hostname: '127.0.0.1',
          username: 'rmqadmin',
          password: 'casa1234',
          vhost: '/'
        }
      };
      const worker = EventWorkerFactory.getWorker('amqp', amqpOptions);
      expect(worker).to.be.instanceof(AMQPWorker);
    });

    it('Should create a KafkaWorker', () => {
      const kafkaOptions = {
        kafkaHost: '127.0.0.1:9092'
      };
      const worker = EventWorkerFactory.getWorker('kafka', kafkaOptions);
      expect(worker).to.be.instanceof(KafkaWorker);
    });

    it('Should create a SQSWorker', () => {
      const sqsOptions = {
        apiVersion: '2012-11-05',
        queueURL: '',
        region: 'us-west-2'
      };
      const worker = EventWorkerFactory.getWorker('sqs', sqsOptions);
      expect(worker).to.be.instanceof(SQSWorker);
    });

    it('Should handle invalid Worker', () => {
      const error = 'Invalid worker type: supported workers [amqp,kafka,sqs]';
      expect(EventWorkerFactory.getWorker.bind(EventWorkerFactory, 'invalid', {})).to.throw(error);
    });
  });

  context('Worker creation Validation', () => {
    it('Should handle invalid AMQP Worker', () => {
      expect(EventWorkerFactory.getWorker.bind(EventWorkerFactory, 'amqp', {})).to.throw(
        'Empty Configurations for AMQPWorker'
      );
      const missingConnect = {
        exchange: 'dummy',
        connectURI: {}
      };

      expect(
        EventWorkerFactory.getWorker.bind(EventWorkerFactory, 'amqp', missingConnect)
      ).to.throw(
        'Missing any of the configurations:[protocol,port,hostname,username,password,vhost]'
      );
    });
  });
});
