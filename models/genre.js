const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 50,
    }
})

const Genre = mongoose.model('Genre', genreSchema);


//From The Client...
function validateGenre(genre) {
    const genreSchema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return genreSchema.validate(genre)
}

exports.genreSchema = genreSchema;
exports.Genre = Genre
exports.validate = validateGenre