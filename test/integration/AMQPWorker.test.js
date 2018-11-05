const chai = require('chai');
const uuidv4 = require('uuid/v4');
const AMQPWorker = require('../../lib/workers/AMQPWorker');
const { amqp } = require('../util/config');

const { expect } = chai;

describe('#AMQPWorker integtest', () => {

  context('Channel creation and initialization', () => {
    const amqpWorker = new AMQPWorker(amqp);
    it('Should initialize amqp Channel', async () => {
      const channel = await amqpWorker.getChannel();

    });

  });

});