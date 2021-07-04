// face service
const rabbitMq = require('../rabbitmq/setup');
const config = require('../config');
const face_model = require('./fs_face_model');

class FaceService{
    constructor(){
    }

    async create(res, message, {callback = undefined} = {}){
        /**
         * Send message to queue
         */

        message['res'] = res;
        const image = message.image;
        delete message.image;
        rabbitMq.send(config.rabbitMqConfig.QUEUE_EXTRACT_FEATURE,
            { image, queue: config.rabbitMqConfig.QUEUE_RES },
            { callback: callback || this.callbackResponse, params: {...message} });
    }
    
    async callbackResponse(params, content){
        // console.log(params);
        const res = params.res;
        const embeddings = content.features;
        const embedding_size = content.features[0].length;
        const status = content.code;
        const detect_model = params.detect_model;
        const identity_model = params.identify_model;
        console.log(`${detect_model}, ${identity_model}`);
        const obj = {
            detect_model,
            identity_model,
            status,
            embedding_size,
            embeddings
        }
        face_model.create(obj);
        res.send(obj);

    }
}

module.exports = new FaceService();