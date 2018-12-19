const amqp = require('amqplib');
const { rabbitmq_connection_string } = require('../config');

let connection = null;
let channel = null;
const exchange = 'logs';
const msg = process.argv.slice(2).join(' ') || 'Hello World';

const open = amqp.connect(rabbitmq_connection_string);

open
  .then(conn => {
    connection = conn;
    return connection.createChannel();
  })
  .then(ch => {
    channel = ch;
    channel.assertExchange(exchange, 'fanout', { durable: false });
    ch.publish(exchange, '', Buffer.from(msg));
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
