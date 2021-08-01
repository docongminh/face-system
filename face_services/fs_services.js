const faceService = require('./fs_rabbitmq_service');

class ExtractService{
    constructor(){}

    async create(req, res){
        /**
         * Create message(image, infor about request)
         */
      const image = req.body.image;
      const name = req.body.name;
      // free space
      delete req.body.image;
      const message = {name, image};
      faceService.create(res, message);
    }

    async search(req, res){
        const image = req.body.image;
        const message = {image};
        faceService.create(res, message);
    }
}

module.exports = new ExtractService();