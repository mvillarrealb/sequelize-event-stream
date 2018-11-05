const chai = require('chai');
const uuidv4 = require('uuid/v4');
const sinon = require('sinon');
const EventStreamDispatcher = require('../../lib/dispatch/EventStreamDispatcher');
const EventWorker = require('../../lib/workers/EventWorker');
const EventWorkerFactory = require('../../lib/workers/EventWorkerFactory');
const FakeWorker = require('../util/FakeWorker');

const { expect } = chai;

const createEvent = () => {
  return {
    event_name: 'orderCreated',
    event_id: uuidv4(),
    event_timestamp: new Date(),
    event_model: 'orders',
    event_body: {}
  };
};

describe('#EventStreamDispatcher', () => {
  const workerOpts = { type: 'kafka', options: { connectionHost: '' } };
  before(() => {
    sinon.stub(EventWorkerFactory, 'getWorker').returns(new FakeWorker());
  });

  after(() => {
    EventWorkerFactory.getWorker.restore();
  });

  context('Initialization', () => {
    it('Should initialize from #create Method', () => {
      const streamDispatcher = EventStreamDispatcher.create(workerOpts);
      expect(streamDispatcher).to.be.instanceof(EventStreamDispatcher);
      expect(streamDispatcher).to.have.property('workerOptions');
    });

    it('Should obtain a worker instance with #getWorker', () => {
      const streamDispatcher = EventStreamDispatcher.create(workerOpts);
      const aWorker = streamDispatcher.getWorker();
      expect(aWorker).to.be.instanceOf(EventWorker);
    });

    it('Should destroy instance with #finish Method', () => {
      const streamDispatcher = EventStreamDispatcher.create(workerOpts);
      streamDispatcher.finish();

      expect(streamDispatcher.getWorker.bind(streamDispatcher)).to.throw(
        'Cannot get Worker from a finished dispatcher'
      );

      expect(streamDispatcher.dispatchEvent.bind(streamDispatcher, {})).to.throw(
        'Cannot dispatch events from a finished dispatcher'
      );

      expect(streamDispatcher.finish.bind(streamDispatcher)).to.throw(
        'Already finished dispatcher'
      );
    });
  });

  /*
  context('Event Dispatching', async () => {
    const dispatcher = EventStreamDispatcher.create(workerOpts);
    const response = await dispatcher.dispatchEvent(createEvent());
    expect(response).to.be.an('object');
  });*/

  context('Worker connection and disconnection', () => {
    it('Should fill task queue when worker is disconnected', async () => {
      const dispatcher = EventStreamDispatcher.create(workerOpts);
      dispatcher.getWorker().mockDisconnect();
      await dispatcher.dispatchEvent(createEvent());
      await dispatcher.dispatchEvent(createEvent());
      await dispatcher.dispatchEvent(createEvent());
      await dispatcher.dispatchEvent(createEvent());
      expect(dispatcher.getWorkerStatus()).to.be.equal('disconnected');
      expect(dispatcher.getPendingQueue()).to.be.an('array');
      expect(dispatcher.getPendingQueue()).to.have.length(4);
    });

    it('Should empty task queue when worker is reconnected', async () => {
      const dispatcher = EventStreamDispatcher.create(workerOpts);
      dispatcher.getWorker().mockDisconnect();
      await dispatcher.dispatchEvent(createEvent());
      await dispatcher.dispatchEvent(createEvent());
      await dispatcher.dispatchEvent(createEvent());
      await dispatcher.dispatchEvent(createEvent());
      expect(dispatcher.getPendingQueue()).to.be.an('array');
      expect(dispatcher.getPendingQueue()).to.have.length(4);

      dispatcher.getWorker().mockReconnect();
      expect(dispatcher.getWorkerStatus()).to.be.equal('connected');
      expect(dispatcher.getPendingQueue()).to.have.length(0);
    });
  });
});
