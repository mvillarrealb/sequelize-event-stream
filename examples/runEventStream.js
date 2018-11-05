const debug = require('debug')('sequelize-event-stream:demo');
const SequelizeEventStream = require('../');
const { models, sequelize } = require('./db');
const { amqp } = require('./config');
const { create, update, bulk } = require('./db/data');

(async function runStream() {
  const type = 'amqp';
  const options = amqp;
  const eventStream = new SequelizeEventStream({ type, options });

  await sequelize.sync({ force: true });

  eventStream.attach(sequelize);

  eventStream.on('created', event => {
    debug('Element created ', event);
  });

  const { poi } = models;

  const result = await poi.create(create);

  await result.update(update);

  await result.destroy();

  await poi.bulkCreate(bulk);
  /**
   * Await until every message is presumed to be received and then invoke a
   * kill signal to shutdown this test
   */
  setTimeout(() => {
    eventStream.shutdown();
  }, 2000);
})();
