const amqp = require('amqplib');
const { rabbitmq_connection_string } = require('../config.js');

const q = 'task_queue';
const open = amqp.connect(rabbitmq_connection_string);

open
  .then(conn => conn.createChannel())
  .then(ch => {
    return ch.assertQueue(q, { durable: true }).then(ok => {
      ch.prefetch(1);
      console.log('[*] Waiting for messages in %s. To exit press CTRL+C', q);
      return ch.consume(
        q,
        msg => {
          if (msg !== null) {
            const secs = msg.content.toString().split('.').length - 1;
            console.log(`[x] received ${msg.content.toString()}`);
            setTimeout(() => {
              console.log(`[x] done`);
            }, secs * 1000);
            ch.ack(msg);
          }
        },
        { noAck: false }
      );
    });
  })
  .catch(err => {
    console.log('some error ocurred!');
  });
