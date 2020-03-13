const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    image: { data: Buffer, contentType: String }
});

module.exports = mongoose.model('Equipment', equipmentSchema);