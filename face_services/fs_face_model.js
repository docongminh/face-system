const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const EmbbedScheme = new mongoose.Schema({
        _id: {type: ObjectId, atuo: true},
        embedding: {type: Array},
        embedding_size: {type: Number},
        model_name: {type: String, required: true}
    }
);

const embedding = mongoose.model('Embedding', EmbbedScheme);
module.exports = embedding; 