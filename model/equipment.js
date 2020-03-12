const mongoose = require('mongoose');

const Equipment = new mongoose.Schema({
    name: {type: String, required: true},
    quantity: {type: Number, required: true},
    image: {data: Buffer, contentType: String}
});

module.exports = mongoose.model('Equipment', Equipment);