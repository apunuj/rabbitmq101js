const amqp = require('amqplib');
const { rabbitmq_connection_string } = require('../config.js');

const q = 'hello';
const open = amqp.connect(rabbitmq_connection_string);

open
  .then(conn => conn.createChannel())
  .then(ch => {
    return ch.assertQueue(q, { durable: false }).then(ok => {
      console.log('[*] Waiting for messages in %s. To exit press CTRL+C', q);
      return ch.consume(q, msg => {
        if (msg !== null) {
          console.log(msg.content.toString());
          ch.ack(msg);
        }
      });
    });
  })
  .catch(err => {
    console.log('some error ocurred!');
  });
