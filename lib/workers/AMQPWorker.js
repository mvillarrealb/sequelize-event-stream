const AMQP = require('amqplib');
const debug = require('debug')('sequelize-event-stream:workers:AMQPWorker');
const EventWorker = require('./EventWorker');
/**
 * AMQPWorker represents a Event dispatch Worker
 * implementing rabbitmq producer to send
 * messages
 * @author Marco Villarreal
 */
class AMQPWorker extends EventWorker {
  constructor(config) {
    super(config);
    this.exchange = config.exchange;
    this.connectURI = config.connectURI;
    this.channel = null;
    this.awaitingCreation = false;
    this.validate(config.connectURI, [
      'protocol',
      'port',
      'hostname',
      'username',
      'password',
      'vhost'
    ]);
  }

  /**
   * Static property containing all the queues
   * created by the worker as the deployment
   * topology
   * @static
   * @property QUEUES
   * @type {Object}
   */
  static get QUEUES() {
    return {
      CREATED: 'created',
      UPDATED: 'updated',
      DESTROYED: 'destroyed',
      BULK_CREATED: 'bulk-created',
      BULK_UPDATED: 'bulk-updated',
      BULK_DESTROYED: 'bulk-destroyed'
    };
  }

  /**
   * Published events to the configured exchange
   * @async
   * @param {Object} eventData
   * @return {Object}
   */
  async publish(eventData) {
    super.publish(eventData);
    const { event_name } = eventData;
    const routingKey = event_name.replace(/-/g, '.');
    debug('fetching Getting AMQP Channel...');
    const channel = await this.getChannel();
    debug(`Performing publish to exchange ${this.exchange}, with routing ${routingKey}`);
    const buffer = Buffer.from(JSON.stringify(eventData), 'UTF-8');
    const publishResponse = await channel.publish(this.exchange, routingKey, buffer);
    debug('Sucessfully published the message');
    return publishResponse;
  }

  /**
   * Perform the binding of all the topology queues to
   * the configured exchange
   * @method bindQueue
   */
  async bindQueues() {
    debug('Binding exchange to queues');
    await Promise.all([
      this.channel.bindQueue(AMQPWorker.QUEUES.CREATED, this.exchange, '*.created'),
      this.channel.bindQueue(AMQPWorker.QUEUES.UPDATED, this.exchange, '*.updated'),
      this.channel.bindQueue(AMQPWorker.QUEUES.DESTROYED, this.exchange, '*.destroyed'),
      this.channel.bindQueue(AMQPWorker.QUEUES.BULK_CREATED, this.exchange, '*.bulk.created'),
      this.channel.bindQueue(AMQPWorker.QUEUES.BULK_UPDATED, this.exchange, '*.bulk.updated'),
      this.channel.bindQueue(AMQPWorker.QUEUES.BULK_DESTROYED, this.exchange, '*.bulk.destroyed')
    ]);
  }

  /**
   * Check all the queues to be configured, by checking
   * it will explicity create the queues if they do not exists
   * @method checkQueues
   */
  async checkQueues() {
    await Promise.all([
      this.channel.assertQueue(AMQPWorker.QUEUES.CREATED),
      this.channel.assertQueue(AMQPWorker.QUEUES.UPDATED),
      this.channel.assertQueue(AMQPWorker.QUEUES.DESTROYED),
      this.channel.assertQueue(AMQPWorker.QUEUES.BULK_CREATED),
      this.channel.assertQueue(AMQPWorker.QUEUES.BULK_UPDATED),
      this.channel.assertQueue(AMQPWorker.QUEUES.BULK_DESTROYED)
    ]);
  }

  /**
   * Returns the channel to the configured rabbitmq broker
   * @async
   * @method getChannel
   * @return {amqp.Channel}
   */
  async getChannel() {
    if (!this.channel) {
      this.awaitingCreation = true;
      debug('Creating new amqp connection');
      const connection = await AMQP.connect(this.connectURI);
      debug('Creating amqp channel from the connection');
      this.channel = await connection.createChannel();
      debug('Channel created, asserting exchange');
      await this.channel.assertExchange(this.exchange, 'topic', this.exchangeOptions);
      await this.checkQueues();
      await this.bindQueues();
      debug('Channel is ready to send messages');
    }
    return this.channel;
  }
}

module.exports = AMQPWorker;
