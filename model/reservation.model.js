const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    title: String,
    userID: { type: Number, required: true },
    reservationType: { type: String, enum: ['locker', 'equipment'] },
    itemID: {type: mongoose.Schema.Types.ObjectId, required: false},
    dateCreated: { type: Date, default: Date.now() },
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
    remarks: {type: String, default: 'N/A'},
    penalty: {type: Number, default: 0}
});

module.exports = mongoose.model('Reservation', reservationSchema);