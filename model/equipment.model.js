const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    available: { type: Number, default: 0 }
    /* ,
    imageURL: { type: String, required: true },
    _itemID: { type: mongoose.Schema.Types.ObjectId, required: true, default: null } */
});

module.exports = mongoose.model('Equipment', equipmentSchema);
