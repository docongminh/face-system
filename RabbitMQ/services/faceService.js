// face service

const rabbitmqService = require('./rabbitmqService');
const config = require('../config');
class FaceService{
  constructor(){}

  async create(res, faceObj, {callback = undefined} = {}){

      faceObj['res'] = res;
      const image = faceObj.image;
      delete faceObj.image;
      rabbitmqService.send(config.rabbitMqConfig.QUEUE_EXTRACT_FEATURE,
        { image, queue: config.rabbitMqConfig.QUEUE_RES },
        { callback: callback || this.callbackCreate, params: {...faceObj} });
      }

  //
  async callbackCreate(params, content) {
    const memberId = params.member._id || params.member;
    const imageId = params.imageId;
    if (!content) {
        return await faceService.createFaceCallback(params.id, memberId, imageId, { error: contants.errors.SERVER_ERR, action: params.action });
    }
    delete content.clientId;

    if (content.code !== 200) {
        return await faceService.createFaceCallback(params.id, memberId, imageId, { error: content, action: params.action, avatarPath: params.avatarPath, thumbnailPath: params.thumbnailPath });
    }

    try {
        const data2Insert = { ...params, ...content };
        data2Insert.avatar = (params.avatarPath || '').replace(config.storeConfig.IMAGE_FOLDER, config.storeConfig.IMAGE_URL);
        data2Insert.thumbnail = (params.thumbnailPath || '').replace(config.storeConfig.IMAGE_FOLDER, config.storeConfig.IMAGE_URL);
        const cface = await faceService.findFace(params, content);
        const face = await Model.create(data2Insert);
        await data2Insert.company.updateCompanyVersion();
        return await faceService.createFaceCallback(params.id, memberId, imageId, { face, action: params.action });
    } catch (error) {
        console.log(error);
        return await faceService.createFaceCallback(params.id, memberId, imageId, { error, action: params.action });
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
    delete faceService.memberStores[memberId];
    const res = memberData.res;

    if (numberFail > 0) {
        if (data.action === 'create') {
            try {
                await Member.remove({ _id: memberId });
                await Model.remove({ member: memberId });
            } catch (error) {
            }
        }

        if (data.action === 'update') {
            try {
                await Model.remove({ member: memberId, status: 'init' });
                const faces = await Model.find({ member: memberId }, '_id');
                await Member.findOneAndUpdate({ _id: memberId }, { faces });
            } catch (error) {
                console.log('error at update member', error);
            }
        }
        return res.send(responseUtils.toErrorResponse({
            ...contants.errors.IMAGE_WRONG,
            data: { imageResults },
        }));
    }

    res.send(responseUtils.toResponse({ ...member.toObject(), imageResults }, contants.messageResponse.CREATE_SUCESS));
}
}

module.exports = new FaceService();