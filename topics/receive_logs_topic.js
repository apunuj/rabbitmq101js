const amqp = require('amqplib');
const { rabbitmq_connection_string } = require('../config');

const args = process.argv.slice(2);
const exchange = 'logs_topic';

if (args.length === 0) {
  console.log('Usage: receive_logs_topic.js <facility>.<severity>');
  process.exit(1);
}

const open = amqp.connect(rabbitmq_connection_string);

open
  .then(conn => conn.createChannel())
  .then(ch => {
    ch.assertExchange(exchange, 'topic', { durable: false });
    return ch
      .assertQueue('', { exclusive: true })
      .then(q => {
        console.log(`[x] waiting for messages in ${q.queue}. To exit, press CTRL+C.`);

        args.forEach(key => {
          ch.bindQueue(q.queue, exchange, key);
        });

        ch.consume(
          q.queue,
          msg => {
            console.log(`[x] ${msg.fields.routingKey} ${msg.content.toString()}`);
          },
          { noAck: true }
        );
      })
      .catch(e => {
        console.log(JSON.stringify(e));
      });
  })
  .catch(e => {
    console.log(JSON.stringify(e));
  });
