# sequelize-event-stream
## *WORK IN PROGRESS :D* 
[![npm version](https://img.shields.io/npm/v/sequelize-event-stream.svg)](https://www.npmjs.com/package/sequelize-event-stream)
[![Build Status](https://travis-ci.org/mvillarrealb/sequelize-event-stream.svg?branch=master)](https://travis-ci.org/mvillarrealb/sequelize-event-stream)
[![codecov](https://codecov.io/gh/mvillarrealb/sequelize-event-stream/branch/master/graph/badge.svg)](https://codecov.io/gh/mvillarrealb/sequelize-event-stream)
![node](https://img.shields.io/node/v/sequelize-event-stream.svg)
[![License](https://img.shields.io/npm/l/sequelize-event-stream.svg?maxAge=2592000?style=plastic)](https://github.com/mvillarrealb/sequelize-event-stream/blob/master/LICENSE)

Event publishing capabilities for your sequelize's models using hooks.

**sequelize-event-stream** adds a sugaring layer to your database connection, listening for every transactional event in sequelize.

![alt text](./docs/images/sequelize-event-stream-overview.png "sequelize-event-stream architecture overview")

The architecture works as follows:

The sequelize event stream is attached to your sequelize's instance, it will listen for every supported hook. Supported hooks are:

* afterCreate
* afterUpdate
* afterDestroy
* afterBulkCreate
* afterBulkUpdate
* afterBulkDestroy

Once fired one of the listed hooks it will use a eventWorker configuration to send your message as an event to a queue/topic from the supported brokers.

# Supported Sinks

* Rabbitmq
* Kafka
* Amazon SQS

# Installation

```bash
npm install --save sequelize-event-stream
```

# Documentation

You can check the full [documentation](https://mvillarrealb.github.io/sequelize-event-stream/) to view full usage of this module.

## Run all tests

To run all unit and integration tests:

```bash
npm test
```

## Run unit tests only

To run the unit tests use the following command:

```bash
npm run unit-test
```

## Run integ tests only

To run the integration tests use the following command:

```bash
npm run integ-test
```

# Generate ESDOC Documentation

To geneate the ESDOC documentation use the following command:

```bash
npm run docs
```

# Running the coverage

To run the coverage report use the following command
```bash
npm run coverage
```