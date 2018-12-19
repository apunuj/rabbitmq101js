require('dotenv').config();

const config = {
  rabbitmq_connection_string: process.env.rabbitmq_connection_string,
  rabbitmq_user: process.env.rabbitmq_user,
  rabbitmq_password: process.env.rabbitmq_password
};

module.exports = config;
