const sinon = require('sinon');
const SequelizeEventStream = require('../../lib/SequelizeEventStream');
const FakeForkWorker = require('../util/FakeForkWorker');
const { sequelize, models } = require('../util/dummyDb');

const { poi } = models;

const createPoi = () => {
  const from = -180;
  const to = 180;
  const fixed = 3;
  return {
    name: `Poi name ${new Date()}`,
    latitude: (Math.random() * (to - from) + from).toFixed(fixed) * 1,
    longitude: (Math.random() * (to - from) + from).toFixed(fixed) * 1
  };
};

const mockWorker = new FakeForkWorker();

SequelizeEventStream.prototype.createWorker = function createWorker() {
  this.worker = mockWorker;
};

before(async () => {
  await sequelize.sync({ force: true });
});

describe('#SequelizeEventStream', () => {
  const type = 'dummy';
  const options = { mock: true };

  context('Hook Triggering', async () => {
    const stream = new SequelizeEventStream({ type, options });
    stream.attach(sequelize);
    it('Should trigger create event', async () => {
      const spy = sinon.spy();
      stream.on('created', spy);
      await poi.create(createPoi());
      sinon.assert.calledOnce(spy);
    });

    it('Should trigger update event', async () => {
      const spy = sinon.spy();
      stream.on('updated', spy);
      const response = await poi.create(createPoi());
      await response.update({ name: 'Updated for event purposses' });
      sinon.assert.calledOnce(spy);
    });

    it('Should trigger destroy event', async () => {
      const spy = sinon.spy();
      stream.on('destroyed', spy);
      const response = await poi.create(createPoi());
      await response.destroy();
      sinon.assert.calledOnce(spy);
    });

    it('Should trigger bulk create events', async () => {
      await poi.bulkCreate([createPoi(), createPoi(), createPoi(), createPoi()]);
      const spy = sinon.spy();
      stream.on('bulk-created', spy);
      sinon.assert.calledOnce(spy);
    });
  });
});
