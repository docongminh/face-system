const faceService = require('./fs_services');

class ExtractService{
    constructor(){}

    async create(req, res){
        /**
         * Create message(image, infor about request)
         */
        // list image
      const images = req.body.image || [];
      // name of detect model
      const detect_model = req.body.detect_model;
      // name of identify model
      const identify_model = req.body.identify_model;
      // free space
      delete req.body.image;
      // storage messages 
      const messages = [];
      const id = `create-embedding-${new Date().getTime()}`;
      //
      for (let i=0; i<images.length; i++){
          // get image base64
          const image = images[i];
          const imageId = `${id}-${i}`;
          const message = { id, imageId, detect_model, identify_model, image, action: 'extact'};
          messages.push(message);
      }
      for (const mess of messages){
          faceService.create(res, mess);
      }
    }
}

module.exports = new ExtractService();