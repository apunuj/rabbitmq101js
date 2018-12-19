const amqp = require('amqplib');
const { rabbitmq_connection_string } = require('../config.js');

let connection = null;
let channel = null;
const q = 'task_queue';
const msg = process.argv.slice(2).join(' ') || 'Hello World';
const open = amqp.connect(rabbitmq_connection_string);

open
  .then(conn => {
    connection = conn;
    return connection.createChannel();
  })
  .then(ch => {
    channel = ch;
    channel.assertQueue(q, { durable: true });
    channel.sendToQueue(q, Buffer.from(msg));
    console.log(`[x] sent ${msg}`);
  })
  .then(() => {
    setTimeout(() => {
      connection.close();
      console.log('exiting from the script');
      process.exit(0);
    }, 500);
  })
  .catch(err => {
    console.log('some error ocurred!');
  });
