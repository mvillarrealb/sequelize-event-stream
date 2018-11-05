const chai = require('chai');
const uuidv4 = require('uuid/v4');
const EventWorker = require('../../../lib/workers/EventWorker');

const { expect } = chai;

describe('#EventWorker', () => {
  context('EventWorker event validation', () => {
    it('Should validate invalid Events', () => {
      const dispatcher = new EventWorker();
      const eventWithType = { event_name: 'orderCreated' };
      const eventWithTypeStr = JSON.stringify(eventWithType);
      expect(dispatcher.publish.bind(dispatcher, eventWithType)).to.throw(
        `Invalid event: Missing required properties: event_id,event_timestamp,event_model,event_body. Blaming event: ${eventWithTypeStr}`
      );
      const eventWithoutBody = {
        event_name: 'orderCreated',
        event_id: uuidv4(),
        event_timestamp: new Date(),
        event_model: 'orders'
      };
      expect(dispatcher.publish.bind(dispatcher, eventWithoutBody)).to.throw(
        `Invalid event: Missing required properties: event_body. Blaming event: ${JSON.stringify(eventWithoutBody)}`
      );
      const eventWithoutId = {
        event_name: 'orderCreated',
        event_timestamp: new Date(),
        event_model: 'orders',
        event_body: {}
      };
      expect(dispatcher.publish.bind(dispatcher, eventWithoutId)).to.throw(
        `Invalid event: Missing required properties: event_id. Blaming event: ${JSON.stringify(eventWithoutId)}`
      );
      const eventWithoutDate = {
        event_name: 'orderCreated',
        event_id: uuidv4(),
        event_model: 'orders',
        event_body: {}
      };
      expect(dispatcher.publish.bind(dispatcher, eventWithoutDate)).to.throw(
        `Invalid event: Missing required properties: event_timestamp. Blaming event: ${JSON.stringify(eventWithoutDate)}`
      );
      const eventWithoutModel = {
        event_name: 'orderCreated',
        event_id: uuidv4(),
        event_timestamp: new Date(),
        event_body: {}
      };
      expect(dispatcher.publish.bind(dispatcher, eventWithoutModel)).to.throw(
        `Invalid event: Missing required properties: event_model. Blaming event: ${JSON.stringify(eventWithoutModel)}`
      );
    });
  });
});
