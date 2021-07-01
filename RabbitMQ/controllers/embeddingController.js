 // embeing controller
const extractService = require('../services/extractService');

class embeddingController{
    constructor(){}

    async create(req, res){
        return extractService.create(req, res);
    }

}

module.exports = new embeddingController();