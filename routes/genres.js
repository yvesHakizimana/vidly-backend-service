const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', async (req, res, next) => {
    const genres = await Genre.find().sort('name');
    if(genres.length > 0) return res.status(200).json(genres);
    res.status(200).send("No records found")
})

router.get('/:id',validateObjectId, async (req, res) => {
    const foundGenre =  await Genre.findById(req.params.id);
    if(!foundGenre)
        return res.status(404).send("No such genre found");
    res.send(foundGenre);
})

router.post('/', auth, async (req, res) => {
    const {error } = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    let newGenre = new Genre({
        name: req.body.name,
    })
    try{
        newGenre = await newGenre.save()
    } catch (err){
        return res.status(400).send(err.message)
    }

    return res.send(newGenre);
})

router.put('/:id',auth,  async (req, res) => {
    //Validate the body request of the genre
    const {error} = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    //Lookup the genre by id and update it directly
    const foundGenre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    if(!foundGenre)
        return res.status(404).send("No such genre with id " + parseInt(req.params.id));
    res.send(foundGenre);
})

router.delete('/:id', [auth, admin],  async (req, res) => {

    const foundGenre = await Genre.findByIdAndDelete(req.params.id)
    if(!foundGenre)
        return res.status(404).send("No such genre with id " + req.params.id);
    return res.send(foundGenre)
})

module.exports = router