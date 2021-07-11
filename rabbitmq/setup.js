const amqp = require('amqplib/callback_api');
const config = require('../config');
const queueStores = {};
const restores = {};

function connectMQ() {
    return new Promise(function fn(resolve, reject) {
        amqp.connect(config.rabbitMqConfig.RABBIT_MQ_URI, function (err, connection) {
            if (err) {
                return reject(err);
            }
            resolve(connection);
        });
    });
}

function createChannel(queue) {
    return new Promise(function fn(resolve, reject) {
        connection.createChannel(function (err, channel) {
            if (err) {
                reject(err);
            }
            channel.assertQueue(queue, {
                durable: true
            });
            resolve(channel);
        });
    });
}


async function send(q, data, { callback = undefined, params = {} }) {
    /**
     * @param {string} q name of queue will be receive message from producer
     * @param {object} data contain image and name of response queue
     */
    if (!connection) {
        connection = await connectMQ();
    }
    const date = new Date();
    data.clientId = `extract-${date.getTime()}-${Math.round(Math.random() * date.getTime())}-${Math.round(Math.random() * date.getTime())}`;
    // save callback response func and its params
    restores[data.clientId] = { callback, params };
    const channel = queueStores[q];
    if (channel) {
        // console.log(`at channel exist, send to ${q}: `, data);
        channel.sendToQueue(q, Buffer.from(JSON.stringify(data)));
        return
    }
    const nChannel = await createChannel(q);
    queueStores[q] = nChannel;    
    
    nChannel.sendToQueue(q, Buffer.from(JSON.stringify(data)));
}

async function listenResult(conn) {
    conn.createChannel((err, channel) => {
        if (err) {
            console.log('rabbitMQ create channel error', err);
            return;
        }
        channel.assertQueue(config.rabbitMqConfig.QUEUE_RES, { durable: true });
        console.log("Begin listen queue " + config.rabbitMqConfig.QUEUE_RES);

        channel.prefetch(1);
        channel.consume(config.rabbitMqConfig.QUEUE_RES, async (msg) => {
            try {
                const content = msg.content.toString();
                const message = JSON.parse(content);
                if (!restores[message.clientId]) {
                    delete restores[message.clientId];
                    channel.ack(msg);
                    return;
                }
                const {callback, params} = restores[message.clientId];
                delete restores[message.clientId];
                try {
                    callback(params, message);
                } catch (error) {
                    console.log("Error at callback", error);
                }
                channel.ack(msg);
            } catch (error) {
                console.error('error at listen: ', error);
                channel.ack(msg);
            }
            // 
        }, { noAck: false }
        );
    });
}

async function connect() {
    try {
        connection = await connectMQ();
        listenResult(connection);
        console.log(`[Success] connect to rabbitmq service successfully with url ${config.rabbitMqConfig.RABBIT_MQ_URI}`);
    } catch (error) {
        console.log('rabbitMQ Error', err);
        setTimeout(() => {
            connect();
        }, 5000);
        return;
    }

};

module.exports = {
    connect,
    send,
}