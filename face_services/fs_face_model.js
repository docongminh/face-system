const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const uniqueValidator = require('mongoose-unique-validator');

const FaceSchema = new mongoose.Schema({
        _id: {type: ObjectId, auto: true},
        name: {type: String, required: true},
        index: {type: Number, require: true, unique: true},
    },
    {
        timestamps: true,
        _id: true,
    });

FaceSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Face', FaceSchema);