const faceService = require('./faceService');
const face_db = require('../models/face');

class extractService{
    constructor(){
        this.face_db = face_db;
    }

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
      console.log(facesStorage);
      for (const faceObj of facesStorage){
          console.log("face Obj: ", faceObj);
          faceService.create(res, faceObj);
      }
    }
}

module.exports = new extractService();