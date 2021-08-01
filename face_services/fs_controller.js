 // embeing controller
const fsService = require('./fs_services');

class FsController{
    constructor(){}

    async create(req, res){
        return fsService.create(req, res);
    }

    async search(req, res){
        return fsService.search(req, res)
    }

}

module.exports = new FsController();