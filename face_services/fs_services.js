// face service
const rabbitMq = require('../rabbitmq/setup');
const directExchange = require('../rabbitmq/publisher');
const config = require('../config');
const face_model = require('./fs_face_model');

class FaceService{
    constructor(){
    }

    async create(res, message){
        /**
         * Send message to queue
         */

        message['res'] = res;
        const image = message.image;
        delete message.image;
        directExchange.send({image}, {callback: this.callbackResponse, params: {...message}})
    }
    
    async callbackResponse(params, content){
        // console.log(params);
        const res = params.res;
        const data = content.data;
        const extract_time = content.extract_time;
        const detect_time = content.detect_time;
        // const detect_model = params.detect_model;
        // const identity_model = params.identify_model;
        // console.log(`${detect_model}, ${identity_model}`);
        const obj = {
            extract_time,
            detect_time,
            data
        }
        const response = {
            code: 200,
            detect_time: detect_time,
            extract_time: extract_time,
            data: data
        }
        face_model.create(obj);
        // sent message to client
        console.log(response)
        res.send(response);

    }
}

module.exports = new FaceService();
