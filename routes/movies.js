const express = require('express');
const router = express.Router();
const {Movie, validate } = require('../models/movie')
const {Genre} = require('../models/genre')

router.get('/', async(req, res) => {
    const movies = await Movie.find().sort('title');
    if(!movies)
        return res.status(200).send("No records found")
    res.status(200).json(movies);

})

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    if(!movie)
        return res.status(404).send("No such movie with that ID found..");
    res.send(movie);

})

router.post('/', async (req, res) => {
    //Validate the body request
    const {error} = validate(req.body);
    if(error)
        res.status(400).send(error.details[0].message)

    const genre = await Genre.findById(req.body.genreId);
    if(!genre)
        return res.status(400).send("Invalid genre Id")

    //Create new movie
    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    })

    movie = await movie.save()
    return res.status(200).json(movie);
})

router.put('/:id', async (req, res) => {
    const {error} = validate(req.body)
    if(error)
        return res.status(400).send(error.details[0].message)

    const genre =  await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send("Invalid Genre Id")

    const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }, { new: true})

    if(!movie) return res.status(404).send("The movie with the given id was not found.")
    res.send(movie)
})

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    if(!movie)
        return res.status(404).send("No such movie with that ID found..");
    res.send(movie)
})

module.exports = router;