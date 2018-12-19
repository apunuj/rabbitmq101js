const amqp = require('amqplib');
const { rabbitmq_connection_string } = require('../config');

const exchange = 'direct_logs';
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('please supply the log level: [info], [warning] or [error]');
  process.exit(1);
}

const open = amqp.connect(rabbitmq_connection_string);

open
  .then(conn => conn.createChannel())
  .then(ch => {
    ch.assertExchange(exchange, 'direct', { durable: false });
    return ch.assertQueue('', { exclusive: true }).then(q => {
      console.log(`[x] waiting for messages in ${q.queue}. To exit, press CTRL+C.`);

      args.forEach(severity => {
        ch.bindQueue(q.queue, exchange, severity);
      });

      ch.consume(
        q.queue,
        msg => {
          console.log(`[x] ${msg.fields.routingKey} ${msg.content.toString()}`);
        },
        { noAck: true }
      );
    });
  });
