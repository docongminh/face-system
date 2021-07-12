const amqp = require('amqplib');
const exchangeName = "face";
const exchangeType = 'direct';
const config = require('../config');
const {connectMQ, createChannel} = require('./utils');
const tempStorage = {};

async function send(connection, exchange, key, message, {callback = undefined ,  params = {} }){
    /**
     * TODO LATER
     */
    tempStorage[key] = {callback, params};
    const channel = createChannel(connection);
    channel.assertExchange(exchange, 'direct',{
        durable: true
    });
    channel.publish(exchange, key, new Buffer.from(message))
    console.log(" [x] Sending %s: '%s'", key, message);
    setTimeout(
        console.log("Error publish message to Queue...!"),
        5000
    );
}

async function listenResponse(connection){
    const channel = createChannel(connection);
    channel.assertQueue()
}

