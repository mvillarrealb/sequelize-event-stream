const EventEmitter = require('events');

class FakeForkWorker extends EventEmitter {
  send(payload) {
    this.emit('something', 'payload');
  }
}

module.exports = FakeForkWorker;
