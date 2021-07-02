// face service
const rabbitMq = require('../rabbitmq/setup');
const config = require('../config');
const face_model = require('./fs_face_model');

class FaceService{
    constructor(){
    }

    async create(res, faceObj, {callback = undefined} = {}){

        faceObj['res'] = res;
        const image = faceObj.image;
        delete faceObj.image;
        rabbitMq.send(config.rabbitMqConfig.QUEUE_EXTRACT_FEATURE,
            { image, queue: config.rabbitMqConfig.QUEUE_RES },
            { callback: callback || this.callbackResponse, params: {...faceObj} });
    }
    
    async callbackResponse(params, content){
        const res = params.res;
        const embeddings = content.features;
        const embedding_size = content.features[0].length;
        const status = content.code;
        const model_name = params.model_name;
        const obj = {
            model_name,
            status,
            embedding_size,
            embeddings
        }
        face_model.create(obj);
        res.send(obj);

    }
    //
    async callbackCreate(params, content) {
       
        const res = params.res;
        const imageId = params.imageId;
        const id = params.id;
        if (!content) {
            return await FaceService.createFaceCallback(id, imageId, { error: contants.errors.SERVER_ERR, action: params.action });
        }
        delete content.clientId;

        if (content.code !== 200) {
            return await FaceService.createFaceCallback(id, imageId, { error: content, action: params.action });
        }

        try {
            return await FaceService.createFaceCallback(id, imageId, { action: params.action });
        } catch (error) {
            console.log(error);
            return await FaceService.createFaceCallback(id, imageId, { error, action: params.action });
        }
    }s

    async createFaceCallback(id, imageId, data) {
        
        const imageResults = [];
        let numberFail = 0;
        for (const mid in memberData.imageIds) {
            if (memberData.imageIds[mid].result === 0) {
                return;
            }
            if (memberData.imageIds[mid].result.code != 200) {
                numberFail += 1;
            }
            imageResults[memberData.imageIds[mid].index] = memberData.imageIds[mid].result;
        }
        // delete faceService.memberStores[memberId];
        const res = memberData.res;
        res.send(responseUtils.toResponse({ ...member.toObject(), imageResults }, contants.messageResponse.CREATE_SUCESS));
}
}

module.exports = new FaceService();