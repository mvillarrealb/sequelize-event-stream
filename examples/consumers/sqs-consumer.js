const AWS = require('aws-sdk');
const { apiVersion, queueURL, region } = require('../config').sqs;

AWS.config.update({ region });

const sqs = new AWS.SQS({ apiVersion });

const params = {
  AttributeNames: ['SentTimestamp'],
  MaxNumberOfMessages: 1,
  MessageAttributeNames: ['All'],
  QueueUrl: queueURL,
  WaitTimeSeconds: 20
};

sqs.receiveMessage(params, (err, data) => {
  if (err) {
    console.log('Error', err);
  } else {
    console.log('Success', data);
  }
});
