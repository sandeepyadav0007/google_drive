const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength :[3,'username musat be 3 characters long']
    },
    email: {
        type: String,
        required: true, 
        unique: true,
        trim: true,
        lowercase: true,
        minlength :[13,'email musat be 13 characters long']

    },
    password: {
        type: String,
        required: true,
        trim :true,
        minlength :[5,'password musat be 5 characters long']

    }
}, {
    timestamps: true
});

const user = mongoose.model('user', userSchema);

module.exports = user;
