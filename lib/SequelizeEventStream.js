const EventEmitter = require('events');
const uuidv4 = require('uuid/v4');
const { fork } = require('child_process');
const path = require('path');
const debug = require('debug')('sequelize-event-stream:main');
/**
 * SequelizeEventStream represents a EventEmitter
 * instance wich can handle custom handlers to
 * sequelize hooks, this handlers comunicate
 * with a forked worker to send messages
 * to a messagery broker from a supported list
 *
 * @author Marco Villarreal
 */
class SequelizeEventStream extends EventEmitter {
  /**
   *
   */
  constructor(workerConfig) {
    super();
    this.createWorker(workerConfig);
  }

  /**
   * Forks the worker and attach the corresponding
   * listeners to control received messages, errors
   * and disconnection status
   * @method createWorker
   * @param {Object} workerConfig
   */
  createWorker(workerConfig) {
    const modulePath = path.join(__dirname, 'dispatch', 'dispatchChildProcess.js');
    debug(`Loading worker from url ${modulePath}`);
    this.worker = fork(modulePath, [JSON.stringify(workerConfig)]);
    this.worker.on('message', this.handleWorkerMessage.bind(this));
    this.worker.on('error', this.handleWorkerError.bind(this));
    this.worker.on('disconnect', this.handleWorkerDisconnect.bind(this));
  }

  /**
   * Attach event listeners to sequelize global
   * hooks via addHook method
   * @param {Sequelize} sequelize The instance to be listened
   */
  attach(sequelize) {
    sequelize.addHook('afterCreate', this.createHookHandler('created').bind(this));
    sequelize.addHook('afterUpdate', this.createHookHandler('updated').bind(this));
    sequelize.addHook('afterDestroy', this.createHookHandler('destroyed').bind(this));

    sequelize.addHook('afterBulkCreate', this.createBulkHookHandler('bulk-created').bind(this));
    sequelize.addHook('afterBulkDestroy', this.createBulkHookHandler('bulk-destroyed').bind(this));
    sequelize.addHook('afterBulkUpdate', this.createBulkHookHandler('bulk-updated').bind(this));
  }

  /**
   * Creates a hook handler from a given event name, returns
   * a valid hook function that can be attached into sequelize.addHook
   * method
   * @method createHookHandler
   * @param {String} eventName The name of the event to be processed
   * @return {Function}
   */
  createHookHandler(eventName) {
    return instance => {
      const modelName = this.getModelName(instance);
      const current = instance.dataValues;
      const previous = instance._previousDataValues;
      const event = {
        event_id: uuidv4(),
        event_name: `${modelName}-${eventName}`,
        event_timestamp: new Date(),
        event_model: modelName,
        event_body: {
          current,
          previous
        }
      };
      debug(`${eventName} event received, delegating to worker...`);
      this.worker.send(event);
      /**
       * Broacast to any class Listening to the event stream
       * the published event
       * @event
       */
      debug(`Broadcasting event ${eventName} to the listening classes`);
      this.emit(eventName, event);
    };
  }

  /**
   * @method createBulkHookHandler
   * @param {String} eventName
   * @return {Function}
   */
  createBulkHookHandler(eventName) {
    return instances => {
      const instance = instances[0];
      const modelName = this.getModelName(instance);
      const event = {
        event_id: uuidv4(),
        event_name: `${modelName}-${eventName}`,
        event_timestamp: new Date(),
        event_model: modelName,
        event_body: instances.map(i => i.get({ plain: true }))
      };
      debug(`${eventName} event received, delegating to worker...`);
      this.worker.send(event);

      debug(`Broadcasting bulk event ${eventName} to the listening classes`);
      this.emit(eventName, event);
    };
  }

  /**
   * @method getModelName
   * @param {Sequelize.Model} instance
   * @return {String}
   */
  getModelName(instance) {
    const modelOptions = instance['_modelOptions'];
    const schema = modelOptions.schema ? `${modelOptions.schema}.` : '';
    const tableName = modelOptions.name.plural;
    return `${schema}${tableName}`;
  }

  /**
   *
   * Handle messages received from the worker
   * just for debugging purposses
   * @method handleWorkerMessage
   * @param {Object} message
   */
  handleWorkerMessage(message) {
    const { error, data, keepalive } = message;
    if (error != null) {
      debug('Got error from eventWorker.js');
    } else if (!keepalive) {
      debug(`Successfully received messade from eventWorker.js ${data}`);
    }
  }

  /**
   * @method handleWorkerError
   * @param {Object} message
   */
  handleWorkerError(message) {
    debug('Error received from the worker');
  }

  /**
   * @method handleWorkerDisconnect
   * @param {Object} message 
   */
  handleWorkerDisconnect(message) {
    debug('Received a disconnect signal from the worker');
    if (!this.isShutDown) {
      debug('Reforking the worker');
    }
  }

  /**
   * Shutsdown the event stream killing the worker
   * and stopping the listeners
   * @method shutdown
   */
  shutdown() {
    debug('Invoking shutdown method');
    this.isShutDown = true;
    this.worker.kill('SIGTERM');
  }
}

module.exports = SequelizeEventStream;
