const Utils = require('../utils/utils');
const { messageResponse } = require('../utils/contants');
const responseUtils = require('../utils/responseUtils');

class BaseController {
    constructor(service) {
        this.service = service;
    }
    async getAll(req, res, message = messageResponse.GET_ALL_SUCESS) {
        try {
            const { query, fields, page, size, sorts } = await Utils.exportParams(req);
            const rs = await this.service.getAll({ query, fields, page, size, sorts });
            return res.send(responseUtils.toResponse(rs, message));
        } catch (error) {
            console.log('GetAll', error);
            return res.send(responseUtils.toErrorResponse(error));
        }
    }

    async create(req, res, message = messageResponse.CREATE_SUCESS) {
        try {
            const rs = await this.service.create(req.body);
            return res.send(responseUtils.toResponse(rs, message));
        } catch (error) {
            console.log('Create', error);
            return res.send(responseUtils.toErrorResponse(error));
        }
    }

    async update(req, res, message = messageResponse.UPDATE_SUCESS) {
        try {
            const query = { _id: req.params['id'] };
            const rs = await this.service.update(query, req.body);
            return res.send(responseUtils.toResponse(rs, message));
        } catch (error) {
            console.log('Update', error);
            return res.send(responseUtils.toErrorResponse(error));
        }
    }

    async get(req, res, message = messageResponse.GET_SUCCESS) {
        try {
            const query = { _id: req.params['id'] };
            const rs = await this.service.get(query);
            return res.send(responseUtils.toResponse(rs, message));
        } catch (error) {
            console.log('Get one', error);
            return res.send(responseUtils.toErrorResponse(error));
        }
    }

    async remove(req, res, message = messageResponse.DELETE_SUCESS) {
        try {
            const query = { _id: req.params['id'] };
            const rs = await this.service.remove(query);
            return res.send(responseUtils.toResponse(rs, message));
        } catch (error) {
            console.log('Remove', error);
            return res.send(responseUtils.toErrorResponse(error, message));
        }

    }
}
module.exports = BaseController;