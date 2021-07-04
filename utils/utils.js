const crypto = require('crypto');
const contants = require('./contants');
function generate_client_id() {
    let dt = new Date().getTime();
    const uuid = "xxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid.toLocaleUpperCase();
}

function pad_with_zeroes(number, length) {

    let my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;

}

function generate_secret_key(length) {
    const result = [];
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join("");
}

function isEmpty(data) {
    if(typeof(data) === 'object'){
        if(JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]'){
            return true;
        }else if(!data){
            return true;
        }
        return false;
    }else if(typeof(data) === 'string'){
        if(!data.trim()){
            return true;
        }
        return false;
    }else if(typeof(data) === 'undefined'){
        return true;
    }else{
        return false;
    }
}

async function exportParams(req) {
    let query = {};
    let params = req.query;
    let page = 0;
    let size = 20;
    let fields = "";
    let sorts = undefined;
    if (params['page'] == 0 || params['page']) {
        page = isNaN(params['page']) ? page : +params['page'];
        delete params['page'];
    }
    if (params['size']) {
        size = isNaN(params['size']) ? size : +params['size'];
        delete params['size'];
    }
    if (params['fields']) {
        fields = params['fields'];
        delete params['fields'];
    }
    query = params;
    for (const key in query) {
        if (!query[key] && query[key] !== 0) delete query[key];
    }
    return { query, fields, page, size, sorts };
}


function normalizeParams(query, fields, page, size, options) {
    if (!fields) {
        fields = "-__v";
    } else {
        fields = fields.replace(',', ' ');
    }
    if (!query) {
        query = {};
    }
    for (const key in query) {
        if ((query[key] + '').trim().length === 0) {
            delete query[key];
        }
    }
    try {
        size = isNaN(size) ? 20 : +size;
    } catch (e) {
        size = 20;
    }
    try {
        page = isNaN(page) ? 0 : +page;
    } catch (e) {
        page = 0;
    }

    if (size > 0) {
        options.limit = size;
        options.skip = size * page;
    }
    return { query, fields, currentSize: size, currentPage: page };
}

function MD5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
}

function stringInject(str, data) {
    if (typeof str === 'string' && (data instanceof Array)) {

        return str.replace(/({{\d}})/g, function (i) {
            return data[i.replace(/{{/, '').replace(/}}/, '')];
        });
    } else if (typeof str === 'string' && (data instanceof Object)) {

        if (Object.keys(data).length === 0) {
            return str;
        }

        for (let key in data) {
            return str.replace(/({{([^}]+)}})/g, function (i) {
                let key = i.replace(/{{/, '').replace(/}}/, '');
                if (!data[key]) {
                    return i;
                }

                return data[key];
            });
        }
    } else if (typeof str === 'string' && data instanceof Array === false || typeof str === 'string' && data instanceof Object === false) {

        return str;
    } else {

        return false;
    }
}

function calcDistance(features1, features2){
    if(!Array.isArray(features1)){
        throw { ...contants.errors.PARAM_INVALID, message: 'features1.invalid' };
    }
    if(!Array.isArray(features2)){
        throw { ...contants.errors.PARAM_INVALID, message: 'features2.invalid' };
    }
    if(features1.length != features2.length ){
        throw { ...contants.errors.PARAM_INVALID, message: 'feauture_size.invalid' };
    }
    if(features1[0].length != features2[0].length ){
        throw { ...contants.errors.PARAM_INVALID, message: 'feauture_size_first.invalid' };
    }
    let sum = 0;
    for(let i = 0; i < features1[0].length; i++){
        sum += (features1[0][i] - features2[0][i]) * (features1[0][i] - features2[0][i]);
    }
    return Math.sqrt(sum);
}

module.exports = {
    exportParams,
    normalizeParams,
    MD5,
    generate_client_id,
    generate_secret_key,
    pad_with_zeroes,
    stringInject,
    isEmpty,
    calcDistance,
};
