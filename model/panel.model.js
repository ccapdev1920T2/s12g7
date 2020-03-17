const mongoose = require('mongoose');

const lockerSchema = require('./locker.model');

const panelSchema = new mongoose.Schema({
    type: { type: String, required: true, enum: ['big', 'small'] },
    building: { type: String, required: true, trim: true },
    level: { type: Number, min: 0, required: true, trim: true },
    lockers: [lockerSchema]
});

module.exports = mongoose.model('Panel', panelSchema);
