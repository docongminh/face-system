// face service
const rabbitMq = require('../rabbitmq/setup');
const config = require('../config');
class FaceService{
  constructor(){}

  async create(res, faceObj, {callback = undefined} = {}){

      faceObj['res'] = res;
      const image = faceObj.image;
      delete faceObj.image;
      rabbitMq.send(config.rabbitMqConfig.QUEUE_EXTRACT_FEATURE,
        { image, queue: config.rabbitMqConfig.QUEUE_RES },
        { callback: callback || this.callbackCreate, params: {...faceObj} });
      }

  //
  async callbackCreate(params, content) {

    if (!content) {
        return await FaceService.createFaceCallback(params.id, memberId, imageId, { error: contants.errors.SERVER_ERR, action: params.action });
    }
    delete content.clientId;

    if (content.code !== 200) {
        return await FaceService.createFaceCallback(params.id, memberId, imageId, { error: content, action: params.action, avatarPath: params.avatarPath, thumbnailPath: params.thumbnailPath });
    }

    try {
        return await FaceService.createFaceCallback(params.id, memberId, imageId, { face, action: params.action });
    } catch (error) {
        console.log(error);
        return await FaceService.createFaceCallback(params.id, memberId, imageId, { error, action: params.action });
    }
  }

  async createFaceCallback(id, memberId, imageId, data) {
    
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