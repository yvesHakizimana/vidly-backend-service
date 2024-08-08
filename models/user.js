const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minLength: 5,
        maxLength: 255,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 1024,
    }
})

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({_id: this._id}, config.get('jwtPrivateKey'))
}

const User = mongoose.model('User', userSchema );

//From The Client...
function validateUser(user) {
    const userSchema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    })
    return userSchema.validate(user)
}

exports.User = User
exports.validate = validateUser