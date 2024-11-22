const { string, required, boolean } = require('joi');
const { verify } = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: [true, 'email must be unique'],
        minlength: [5, '5char'],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'password must be provide'],
        trim: true,
        select: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationCode:{
        type: String,
        select: false,        
    },
    verificationCodeValidation:{
        type: String,
        select: false,        
    },
    forgotPasswordCode:{
        type: String,
        select: false,        
    },
    forgotPasswordCodeValidation:{
        type: Number,
        select: false,        
    },

},{
    Timestamp:true
});

module.exports =mongoose.model("User", userSchema);