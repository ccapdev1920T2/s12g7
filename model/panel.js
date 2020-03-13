const mongoose = require('mongoose');

const panelSchema = new mongoose.Schema({
    type: { type: String, required: true },
    building: { type: String, required: true }, // TODO: enum for buildings
    level: { type: Number, min: 0, required: true },
    lockers: [
        {
            number: { type: Number, required: true, unique: true },
            status: { 
                type: String, 
                required: true, 
                enum: ['vacant', 'occupied', 'broken', 'uncleared'] 
            }
        }
    ]
});

module.exports = mongoose.model('Panel', panelSchema);