const amqp = require('amqplib');
const config = require('./config');
const setup = require('./setup');
const tempStorage = {};

async function send(message, {callback=undefined, params = {}}){
    /**
     * TODO LATER
     */
     tempStorage["callback"] = {callback, params};
    const connection = await setup.connectMQ('amqp://guest:guest@localhost:5672');
    const channel = await setup.createChannel(connection);
    channel.assertExchange(config.broker.exchange_name, config.broker.exchange_type, {
        durable: config.broker.durable
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
        durable: config.broker.durable
    });
    channel.assertQueue(config.broker.response_queue);
    channel.bindQueue(config.broker.response_queue, config.broker.exchange_name, config.routing_keys.response_key);
    channel.consume(config.broker.response_queue, async function(msg){
        try{
            const content = msg.content.toString();
            const data = JSON.parse(content);
            if(!tempStorage["callback"]){
                delete tempStorage["callback"];
                channel.ack(msg)
            }
            const {callback, params} = tempStorage["callback"];
            try{
                callback(params, data);
            }catch(error){
                console.log("Error callback function: ", error);
            }
        }  catch(error){
            console.log("Error consume: ", config.broker.response_queue)
        }
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
