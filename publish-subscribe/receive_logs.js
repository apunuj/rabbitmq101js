const amqp = require('amqplib');
const { rabbitmq_connection_string } = require('../config');

const open = amqp.connect(rabbitmq_connection_string);
const exchange = 'logs';

open
  .then(conn => conn.createChannel())
  .then(ch => {
    ch.assertExchange(exchange, 'fanout', { durable: false });
    return ch.assertQueue('', { exclusive: true }).then(ok => {
      console.log(`[x] waiting for messages in ${ok.queue}. To exit, press CTRL+C.`);
      ch.bindQueue(ok.queue, exchange, '');
      ch.consume(
        ok.queue,
        msg => {
          if (msg.content) {
            console.log(`[x] received ${msg.content.toString()}`);
          }
        },
        { noAck: true }
      );
    });
  });
