
// RabbitMQ config
const rabbitMqConfig = {
    RABBIT_MQ_URI: 'amqp://guest:guest@localhost:5672',
    QUEUE_DETECT: 'Q_DETECT',
    QUEUE_CREATE_RES: 'Q_REGISTER_RES',
    QUEUE_RES: 'Q_RES',
    QUEUE_IDENTIFY: 'Q_IDEN',
    QUEUE_EXTRACT_FEATURE: 'Q_EXTRACT_FEATURE',
};

const mongodb = {
    CONFIG_MONGO_URI: 'mongodb://localhost:27017/face-service',
};

module.exports = {
    rabbitMqConfig,
    mongodb,
}