const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const EmbbedScheme = new mongoose.Schema({
        // _id: {type: ObjectId, atuo: true},
        detect_time: {type: String, required: true},
        detect_time: {type: String, required: true},
        data: {type: {}, required: true},
    }
);

module.exports = mongoose.model('Embedding', EmbbedScheme);