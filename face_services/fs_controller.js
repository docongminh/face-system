 // embeing controller
const extractService = require('./fs_extract');

class FsController{
    constructor(){}

    async create(req, res){
        return extractService.create(req, res);
    }

}

module.exports = new FsController();