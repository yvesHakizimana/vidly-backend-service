const mongoose = require('mongoose');
const Joi = require('joi');

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 50,
    }
}))


//From The Client...
function validateGenre(genre) {
    const genreSchema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return genreSchema.validate(genre)
}

exports.Genre = Genre
exports.validate = validateGenre