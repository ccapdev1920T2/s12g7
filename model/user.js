const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String, required: true },
    idNum: { type: String, required: true },
    college: {
        type: String, required: true,
        enum: [
            'Brother Andrew Gonzalez College of Education',
            'College of Computer Studies',
            'College of Liberal Arts',
            'College of Science',
            'Gokongwei College of Engineering',
            'Ramon V. Del Rosario College of Business',
            'School of Economics']
    },
    degreeProg: { type: String, required: true },
    contactNum: { type: Number, required: true },
    isAdmin: { type: Boolean, default: false },
    profilePicURL: {type: String, default: 'default-pic.jpg'}
});

module.exports = mongoose.model('User', userSchema);