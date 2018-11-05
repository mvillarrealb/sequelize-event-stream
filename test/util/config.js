module.exports = {
  amqp: {
    exchange: 'sequelize-event-stream',
    connectURI: {
      protocol: 'amqp',
      port: 5672,
      hostname: '127.0.0.1',
      username: 'rmqadmin',
      password: 'casa1234',
      vhost: '/'
    }
  },
  sqs: {
    apiVersion: '2012-11-05',
    queueURL: '',
    region: 'us-west-2'
  },
  kafka: {
    kafkaHost: '127.0.0.1:9092'
  }
};
