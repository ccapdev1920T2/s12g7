const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    title: String,
    userID: { type: Number, required: true },
    reservationType: { type: String, enum: ['locker', 'equipment'] },
    item: {type: mongoose.Schema.Types.ObjectId, refPath: 'onItemType'},
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
    penalty: {type: Number, default: 0},
    onItemType: {
        type: String,
        required: true,
        enum: ['Equipment', 'Locker']
    }
});

module.exports = mongoose.model('Reservation', reservationSchema);