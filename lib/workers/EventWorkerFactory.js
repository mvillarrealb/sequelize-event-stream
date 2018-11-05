const AMQPWorker = require('./AMQPWorker');
const KafkaWorker = require('./KafkaWorker');
const SQSWorker = require('./SQSWorker');
/**
 * EventWorkerFactory is a simple Factory to create EventWorker instances
 * @example
 *  const amqpWorker = EventWorkerFactory.getWorker('amqp',config);
 */
class EventWorkerFactory {
  /**
   * A basic list of the supported workers
   * @property SUPPORTED_WORKER
   * @static
   * @type {Object}
   */
  static get SUPPORTED_WORKERS() {
    return {
      amqp: AMQPWorker,
      kafka: KafkaWorker,
      sqs: SQSWorker
    };
  }

  /**
   * Create and returns a Worker based on the worker type and
   * configuration options
   * @static
   * @throws Error if a workerType is unsupported
   * @param {String} workerType The type of worker to be created(amqp,kafka,sqs)
   * @param {Object} workerOptions The specific worker config
   * @return {EventWorker}
   */
  static getWorker(workerType, workerOptions) {
    const supportedWorkers = Object.keys(EventWorkerFactory.SUPPORTED_WORKERS);
    const properties = Object.keys(workerOptions);
    if (supportedWorkers.indexOf(workerType) < 0) {
      const errMessage = `Invalid worker type: supported workers [${supportedWorkers.join(',')}]`;
      throw new Error(errMessage);
    }
    const WorkerClass = EventWorkerFactory.SUPPORTED_WORKERS[workerType];
    if (properties.length <= 0) {
      throw new Error(`Empty Configurations for ${WorkerClass.name}`);
    }

    return new WorkerClass(workerOptions);
  }
}

module.exports = EventWorkerFactory;
