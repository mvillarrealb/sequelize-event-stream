const EventWorker = require('../../lib/workers/EventWorker');

class FakeWorker extends EventWorker {
  /**
   *
   */
  constructor(config) {
    super(config);
    this.mock = true;
  }

  async publish(eventData) {
    super.publish(eventData);
    return Promise.resolve(eventData);
  }

  mockDisconnect() {
    this.emit('statusChanged', 'disconnected');
  }

  mockReconnect() {
    this.emit('statusChanged', 'connected');
  }
}

module.exports = FakeWorker;
