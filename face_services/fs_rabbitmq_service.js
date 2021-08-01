// face service
const directExchange = require('../rabbitmq/publisher');
const config = require('../config');
const face_model = require('./fs_face_model');
const { response } = require('express');

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
        const phase = 'insert'
        directExchange.send({image, phase}, {callback: this.createCallback, params: {...message}});
    }
    
    async search(res, message){
        const image = message.image;
        delete message.image;
        const phase = 'search'
        directExchange.send({image, phase}, {callback: this.searchCallback, params: {...res}});
    }

    async createCallback(params, content){
        const {res, name} = params;
        const {detect_time, extract_time, index, total_entities} = content;
        const obj = {name, index};
        face_model.create(obj);
        const response = {
            code: 200,
            time_detect: detect_time,
            time_extract: extract_time,
            entities: total_entities,
            message: "Create successful !"
        }
        res.send(response);
    }

    async searchCallback(res, content){
        const {time_detect, time_extract, index, num_entities, distance} = content;
        if(distance){
            const name = await face_model.findOne({index: index});
            const response = {
                code: 200,
                name: name,
                time_detect: time_detect,
                time_extract: time_extract,
                entities: num_entities,
                Message: "Successful search person !"
            }
        }
        else{
            const response = {
                code: 200,
                message: "Not match"
            }
        }
        res.send(response);
    }

}

module.exports = new FaceService();
