const mongoose = require('mongoose');

const lockerSchema = require('./locker');

const panelSchema = new mongoose.Schema({
    type: { type: String, required: true },
    building: { type: String, required: true }, // TODO: enum for buildings
    level: { type: Number, min: 0, required: true },
    lockers: [lockerSchema]
});

module.exports = mongoose.model('Panel', panelSchema);