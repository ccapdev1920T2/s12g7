const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    idNum: {type: String, required: true},
    collegeName: {type: String, required: true},
    degreeProg: {type: String, required: true},
    contactNum: {type: String, required: true},
    isAdmin: {type: Boolean, default:false, required: true}
});

module.exports = mongoose.model('User', userSchema);