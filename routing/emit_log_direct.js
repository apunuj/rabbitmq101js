const amqp = require('amqplib');
const { rabbitmq_connection_string } = require('../config');

let connection = null;
const exchange = 'direct_logs';
const args = process.argv.slice(2);
const msg = args.slice(1).join(' ') || 'Hello World';
const severity = args.length > 0 ? args[0] : 'info';
const open = amqp.connect(rabbitmq_connection_string);

open
  .then(conn => {
    connection = conn;
    return connection.createChannel();
  })
  .then(ch => {
    ch.assertExchange(exchange, 'direct', { durable: false });
    ch.publish(exchange, severity, Buffer.from(msg));
    console.log(`[x] sent ${severity} ${msg}`);
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
