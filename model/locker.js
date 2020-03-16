const mongoose = require('mongoose');

exports.lockerSchema = new mongoose.Schema({
    number: { type: Object, required: true, unique: true },
    status: {
        type: String,
        required: true,
        enum: ['vacant', 'occupied', 'broken', 'uncleared']
    }
});