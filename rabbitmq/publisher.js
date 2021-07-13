const amqp = require('amqplib');
const config = require('./config');
const setup = require('./setup');
const tempStorage = {};

async function send(message){
    /**
     * TODO LATER
     */
    const connection = await setup.connectMQ('amqp://guest:guest@localhost:5672');
    const channel = await setup.createChannel(connection);
    channel.assertExchange(config.broker.exchange_name, config.broker.exchange_type, {
        durable: false
    });
    const sent = channel.publish(config.broker.exchange_name,
                            config.routing_keys.detect_key,
                            Buffer.from(JSON.stringify(message)));
    if(sent){
        console.log("Sent message to '%s' ", config.broker.detect_queue);
        return
    }
    throw new Error(`Fail sending message to "${config.broker.detect_queue}" queue, "${JSON.stringify(message)}"`)
}

async function listenResponse(connection){
    /**
     * 
     */
    const channel = await setup.createChannel(connection);
    channel.assertExchange(config.broker.exchange_name, config.broker.exchange_type, {
        durable: false
    });
    channel.assertQueue(config.broker.response_queue);
    channel.bindQueue(config.broker.response_queue, config.broker.exchange_name, config.routing_keys.response_key);
    channel.consume(config.broker.response_queue, function(msg){
        console.log("Consume this message: '%s'", msg.content);  
    }, {
        noAck: false
    });
}

async function run(){
    try{
        const connection = await setup.connectMQ('amqp://guest:guest@localhost:5672');
        listenResponse(connection);
        console.log(`Listening ${config.broker.response_queue}`);
    } catch(error){
        console.log("Error run: ", error);
        setTimeout(function(){
            run()
        }, 5000);
        return
    }
}

module.exports = {
    run,
    send,
}
