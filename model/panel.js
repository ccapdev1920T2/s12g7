const mongoose = require('mongoose');

const panelSchema = new mongoose.Schema({
    type: { type: String, required: true },
    building: { type: String, required: true },
    floor: { type: String, required: true },
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