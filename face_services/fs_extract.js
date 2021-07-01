const faceService = require('./fs_services');

class ExtractService{
    constructor(){}

    async create(req, res){
      const images = req.body.image || [];
      delete req.body.image;
      const facesStorage = [];
      const id = `create-embedding-${new Date().getTime()}`;
      //
      for (let i=0; i<images.length; i++){
          // get image base64
          const image = images[i];
          const imageId = `${id}-${i}`;
          const imageIds = {};
          imageIds[imageId] = { result: 0, index: i };
          const dataFace = { ...req.body, id, imageId, image, action: 'extract'};
          facesStorage.push(dataFace);
      }
      for (const faceObj of facesStorage){
          faceService.create(res, faceObj);
      }
    }
}

module.exports = new ExtractService();