const constant = require('./contants');

function toResponse(data = {}, message = '') {
  if (data && data['meta']) {
    return {
      code: 200,
      message: message,
      meta: data.meta,
      data: data.data,
    }
  }
  return {
    code: 200,
    message: message,
    data,
  }
}


function toErrorResponse(error) {
  if (error.path && error.kind === 'ObjectId') {
    return {...constant.errors.NOT_FIND_OBJECT, data: undefined};
  }
  if (error.code == '11000') {
    for (const key in error.keyPattern) {
      return {...constant.errors.SIMILAR_USER_EXIST, message: `${key}.existed`, data: undefined};
    }
    return {...constant.errors.SIMILAR_USER_EXIST, message: `object.existed`, data: undefined};
  }
  if (!isNaN(error.code)) {
    return error;
  }
  if (error.errors) {
    for (const key in error.errors) {
      const err = error.errors[key];
      switch (err.kind) {
        case 'required':
          return {...constant.errors.PARAM_REQUIRED, message: `${key}.missing`, data: undefined};
        case 'enum':
          return {...constant.errors.PARAM_INVALID, message: `${key}.invalid`, data: undefined};
        case 'unique':
          return {...constant.errors.OBJECT_EXIST, message: `${key}.existed`, data: undefined};
        case 'maxlength':
          return {...constant.errors.OBJECT_MAX_LENGTH, message: `${key}.maxLength`, data: undefined};
        case 'max':
          return {...constant.errors.OBJECT_MAX_NUMBER, message: `${key}.maxNumber`, data: undefined};
      }
    }
    return error;
  }

  const msg = {...constant.errors.SERVER_ERR, message: error.message, data: undefined};
  return msg;
}

function authenErrorResponse(err) {
  const msg = {...constant.errors.AUTHENTICATE_ERROR}
  return msg;
}

module.exports = {
  toResponse,
  toErrorResponse,
  authenErrorResponse
};