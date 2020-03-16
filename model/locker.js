const mongoose = require('mongoose');

exports.lockerSchema = new mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    status: {
        type: String,
        required: true,
        enum: ['vacant', 'occupied', 'broken', 'uncleared']
    }
});