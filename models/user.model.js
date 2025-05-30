const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'task'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);