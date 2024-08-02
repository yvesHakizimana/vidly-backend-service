const express = require('express');
const Joi = require("joi");
const router = express.Router();
const mongoose = require('mongoose');

const Genre = new mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 50,
    }
}))



router.get('/', async (req, res) => {
    const genres = await Genre
        .find()
        .sort('name');
    if(genres.length > 0) {
        res.status(200).json(genres);
        return
    }
    res.status(200).send("No records found")
})

router.get('/:id', async (req, res) => {
    const foundGenre =  await Genre.findById(req.params.id);
    if(!foundGenre)
        return res.status(404).send("No such genre found");
    res.send(foundGenre);
})

router.post('/', async (req, res) => {
    const {error } = validateGenre(req.body);
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    let newGenre = new Genre({
        name: req.body.name,
    })
    newGenre = await newGenre.save()
    return res.send(newGenre);
})

router.put('/:id', async (req, res) => {
    //Validate the body request of the genre
    const {error} = validateGenre(req.body);
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    //Lookup the genre by id and update it directly
    const foundGenre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    if(!foundGenre)
        return res.status(404).send("No such genre with id " + parseInt(req.params.id));req.params.id
    res.send(foundGenre);
})

router.delete('/:id', async (req, res) => {
    const foundGenre = await Genre.findByIdAndDelete(req.params.id)
    if(!foundGenre)
        return res.status(404).send("No such genre with id " + req.params.id);
    return res.send(foundGenre)
})

//From The Client...
function validateGenre(genre) {
    const genreSchema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return genreSchema.validate(genre)
}

module.exports = router