const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    mobile:{
        type: String,
        required: true,
    },
    skills:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    confirmpassword:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('user', userModel);