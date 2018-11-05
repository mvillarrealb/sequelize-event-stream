const EventEmitter = require('events');
/**
 * EventWorker is a EventEmitter base abstraction
 * to represent every event publisher instance,
 * all publisher must inherit this class.
 *
 * @class EventWorker
 * @author Marco Villarreal
 */
class EventWorker extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
  }

  /**
   * Basic publish abstraction, this is an incomplete method
   * it just validates the event to be published
   *
   * @param {Object} eventData Event data to be published
   */
  publish(eventData) {
    const eventAttributes = Object.keys(eventData);
    const missingAttributes = this.getEventAttributes().filter(
      attr => eventAttributes.indexOf(attr) < 0
    );
    if (missingAttributes.length > 0) {
      const event = JSON.stringify(eventData);
      const errMessage = `Invalid event: Missing required properties: ${missingAttributes}. Blaming event: ${event}`;
      throw new Error(errMessage);
    }
  }

  /**
   * Parameter validation  of a received object
   * against an Array of expected attributes,
   * used by the implementing classes to validate
   * its constructor parameters
   *
   * @param {Object} received The received Object
   * @param {Array} expected The list of expected parameters
   * @throws {Error} When a expected parameter is missing
   */
  validate(received, expected) {
    const receivedAttributes = Object.keys(received);
    const missing = expected.filter(attr => receivedAttributes.indexOf(attr) < 0);
    if (missing.length > 0) {
      const expectedList = expected.join(',');
      throw new Error(`Missing any of the configurations:[${expectedList}]`);
    }
  }

  /**
   * Returns the list of event attributes
   * @method getEventAttributes
   * @return {Array}
   */
  getEventAttributes() {
    return ['event_name', 'event_id', 'event_timestamp', 'event_model', 'event_body'];
  }
}

module.exports = EventWorker;
