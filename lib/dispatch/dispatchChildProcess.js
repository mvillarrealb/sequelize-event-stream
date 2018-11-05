const debug = require('debug')('sequelize-event-stream:workers:eventWorker');
const EventStreamDispatcher = require('./EventStreamDispatcher');

process.argv.splice(0, 2);
const workerOpts = JSON.parse(process.argv[0]);

debug('Instantiating EventStreamDispatcher');
const streamWorker = EventStreamDispatcher.create(workerOpts);
debug('Event worker is ready to publish your events');

process.on('message', async event => {
  debug('Worker received message, handling publish stream');
  let data = null;
  let error = null;
  try {
    data = await streamWorker.dispatchEvent(event);
    debug('Got response from  publishWorker');
  } catch (exception) {
    console.log(exception);
    error = exception;
  }
  debug('Sending response back to the stream parent');
  process.send({ error, data });
});

setInterval(() => {
  process.send({
    error: null,
    keepalive: true,
    data: new Date()
  });
}, 1000);
