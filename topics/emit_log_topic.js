const amqp = require('amqplib');
const { rabbitmq_connection_string } = require('../config');

const open = amqp.connect(rabbitmq_connection_string);
let connection = null;
const exchange = 'logs_topic';
const args = process.argv.slice(2);
const key = args.length > 0 ? args[0] : 'anonymous.info';
const msg = args.slice(1).join(' ') || 'Hello World!';

open
  .then(conn => {
    connection = conn;
    return connection.createChannel();
  })
  .then(ch => {
    ch.assertExchange(exchange, 'topic', { durable: false });
    ch.publish(exchange, key, Buffer.from(msg));
    console.log(`[x] sent ${key} ${msg}`);
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
