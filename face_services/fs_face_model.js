const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const EmbbedScheme = new mongoose.Schema({
        // _id: {type: ObjectId, atuo: true},
        embedding: {type: Array},
        embedding_size: {type: Number},
        detect_model: {type: String, required: true},
        identity_model: {type: String, required: true}
    }
);

module.exports = mongoose.model('Embedding', EmbbedScheme);