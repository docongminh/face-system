const contants = require('../utils/contants');
const Utils = require('../utils/utils');
const {isEmpty} = require('../utils/utils');

class BaseService {
  constructor(model) {
    this.model = model;
  }

  async queryCondition(query, {fieldSchemaCustom = []} = {}) {
    const fieldSchema = await this.getFieldSchema(query);
    if (isEmpty(fieldSchemaCustom)) {
      fieldSchemaCustom = fieldSchema;
    }
    if ("search" in query) {
      query = {
        ...query,
        $or: [
          ...fieldSchemaCustom.map(field => ({
            [field]: new RegExp(query.search.trim(), 'i')
          }))
        ]
      };
      delete query["search"];
    }
    for (const i in fieldSchema.data) {
      query[i] = {$regex: `${query[i].trim()}`, $options: 'i'};
    }
    return query;
  }

  getFieldSchema(body, {parentKeys = '', model = this.model} = {}) {
    const data = {};
    const keys_data = [];
    const keys = Object.keys(model.schema.obj);
    keys.map(key => {
      if (body.hasOwnProperty(key) && model.schema.path(key).instance === 'String') {
        data[`${parentKeys}${key}`] = body[key];
      }
    });
    keys.map(key => {
      if (model.schema.path(key).instance === 'String') {
        keys_data.push(`${parentKeys}${key}`);
      }
    });
    return {keys_data, data};
  }

  async getAll({query = {}, fields = "", page = 0, size = 20, sorts = undefined, populate = [], isCount = true, fieldSchemaCustom = [], isFull = false} = {}) {
    if (isFull) {
      size = -1;
    }
    const options = {sort: {'_id': -1}};
    if (sorts && typeof (sorts) === 'object') {
      options['sort'] = sorts;
    }
    const rs = Utils.normalizeParams(query, fields, page, size, options);
    if (Object.keys(rs.query).length !== 0) {
      rs.query = await this.queryCondition(rs.query, {fieldSchemaCustom});
    }
    const data = await this.model.find(rs.query, rs.fields, options).populate(populate).lean();
    if (!isCount) {
      return {data};
    }
    const count = await this.model.count(rs.query);
    const numberPage = size > 0 ? Math.ceil((count / size)) : 0;
    const meta = {count, size, totalPage: numberPage, page};
    return {meta, data};
  }

  async create(object) {
    return await this.model.create(object);
  }

  async update(query, object) {
    try {
      for (const att of this.model.getIgnoreUpdateAttr() || []) {
        delete object[att];
      }
    } catch (error) {
    }
    const rs = await this.model.findOneAndUpdate(query, object, {new: true});
    if (!rs) {
      throw {...contants.errors.NOT_FIND_OBJECT, desc: 'Cannot update'};
    }
    return rs;
  }

  async get(query, populate = []) {
    const rs = await this.model.findOne(query).populate(populate);
    if (!rs) {
      throw {...contants.errors.NOT_FIND_OBJECT, desc: 'Cannot find'};
    }
    return rs;
  }

  async remove(query) {
    const rs = await this.model.findOneAndRemove(query);
    if (!rs) {
      throw {...contants.errors.NOT_FIND_OBJECT, desc: 'Cannot remove'};
    }
    return rs;
  }
}

module.exports = BaseService;