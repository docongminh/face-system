const amqp = require('amqplib/callback_api');

function connectMQ(host){
    return new Promise(function fn(resolve, reject){
        amqp.connect(host, function(error, connection){
            if(error){
                reject(error);
            }
            resolve(connection);
            console.log("[INFO] Successful connect RabbitMQ server !")
        });
    });
}

function createChannel(connection){
    return new Promise(function fn(resolve, reject){
        connection.createChannel(function(error, channel){
            if(error){
                reject(error);
            }
            resolve(channel);
            console.log("[INFO] Sucessful create channel !");
        });
    });
}

module.exports = {connectMQ, createChannel};
