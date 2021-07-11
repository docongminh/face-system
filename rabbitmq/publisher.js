const amqp = require('amqplib');
const exchangeName = "face";
const exchangeType = 'direct';
const config = require('../config');
const host = 'localhost:5672'
const {connectMQ, createChannel} = require('./utils');
const tempStorage = {};

async function send(exchange, host, rout_key, message, {callback = undefined ,  params = {} }){
    tempStorage[rout_key] = {callback, params};
    const connection = connectMQ(host);
    const channel = createChannel(connection);
    channel.pushlish(exchange, key, new Buffer(message))
    console.log(" [x] Sending %s: '%s'", key, message);
    setTimeout(
        function(){
            connection.close();
        }
        5000;
    );
}

