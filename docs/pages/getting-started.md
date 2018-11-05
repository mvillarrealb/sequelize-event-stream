# Getting Started

## Creating an Instance

Creating an instance is quite easy you just have to import the module
and instantiate the class with the configuration.

```javascript
const SequelizeEventStream = require('sequelize-event-stream');

const configuration = {
  type: 'amqp'| 'kafka' | 'sqs',
  options: {
    ...
  }
};

const eventStream = new SequelizeEventStream(configuration);
```

## Attaching to sequelize

To enable the event triggering capability use the attach method to start the hook handling.

```javascript
const sequelize = new Sequelize(..);
eventStream.attach(sequelize);
```
## Trigger Any hook

After the eventStream is successfully attached to sequelize's then just trigger a hook and see the magic happens(or not).

## Check with consumers