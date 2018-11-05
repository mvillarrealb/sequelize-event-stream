const debug = require('debug')('sequelize-event-stream:dispatch:event-stream-dispatcher');
const EventWorkerFactory = require('../workers/EventWorkerFactory');

class EventStreamDispatcher {
  /**
   *
   * @param {*} workerOptions
   */
  constructor(workerOptions) {
    this.workerOptions = workerOptions;
    this.pendingQueue = [];
    this.worker = null;
    this.isFinished = false;
    this.workerStatus = 'connected';
  }

  static create(workerOptions) {
    return new EventStreamDispatcher(workerOptions);
  }

  finish() {
    if (this.isFinished) {
      throw new Error('Already finished dispatcher');
    }
    if (this.worker != null) {
      this.worker.finish();
    }
    this.pendingQueue = [];
    this.workerStatus = 'disconnected';
    this.isFinished = true;
    this.worker = null;
  }

  dispatchEvent(event) {
    let response = null;
    if (this.isFinished) {
      throw new Error('Cannot dispatch events from a finished dispatcher');
    }
    if (this.getWorkerStatus() === 'disconnected') {
      this.pendingQueue.push(event);
      debug('Worker is currently disconnected, pushing to pending queue');
      response = Promise.resolve(event);
    } else if (this.getWorkerStatus() === 'connected') {
      debug('Using the worker to publish the message');
      response = this.getWorker().publish(event);
    }
    return response;
  }

  workerStatusChanged(status) {
    this.workerStatus = status;
    this.handleWorkerStatus();
  }

  getWorker() {
    if (this.isFinished) {
      throw new Error('Cannot get Worker from a finished dispatcher');
    }
    if (this.worker === null) {
      const { type, options } = this.workerOptions;
      this.worker = EventWorkerFactory.getWorker(type, options);
      this.worker.on('statusChanged', this.handleWorkerStatus.bind(this));
    }
    return this.worker;
  }

  getWorkerStatus() {
    return this.workerStatus;
  }

  getPendingQueue() {
    return this.pendingQueue;
  }

  async handleWorkerStatus(status) {
    debug(`Got new status from the worker: ${status}`);
    this.workerStatus = status;
    if (this.workerStatus === 'connected') {
      debug('Check pending queue');
      while (this.getPendingQueue().length > 0) {
        const pendingMessage = this.getPendingQueue().shift();
        this.getWorker().publish(pendingMessage);
      }
    }
  }
}

module.exports = EventStreamDispatcher;
