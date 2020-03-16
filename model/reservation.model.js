const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    userID: {type: Number, required: true},
    reservationType: { type: String, enum: ['locker', 'equipment'] },
    date: { type: Date, default: Date.now },
    status: { 
        type: String, 
        enum: [
            'Pending', 
            'For Pickup', 
            'To Pay', 
            'On Rent', 
            'Denied', 
            'Uncleared', 
            'Returned'
        ]
    },
    description: String,
    remarks: String
});

module.exports = mongoose.model('Reservation', reservationSchema);