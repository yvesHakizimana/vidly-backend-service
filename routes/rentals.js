const express = require('express');
const router = express.Router();
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const { Rental, validate } = require('../models/rental');

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut')
    if(!rentals)
        return res.status(404).send("No rentals found");
    res.send(rentals)
})

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id)
    if(!rental)
        return res.status(404).send("No rental found with that id");
    res.send(rental)
})

router.post('/', async (req, res) => {
    //Validate the body request to avoid malicious sites or other things like that
    const {error} = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message)

    const foundMovie = await Movie.findById(req.body.movieId)
    if(!foundMovie)
        return res.status(400).send("Invalid Movie Id")

    const foundCustomer = await Customer.findById(req.body.customerId)
    if(!foundCustomer)
        return res.status(400).send("Invalid Customer Id")

    if(foundMovie.numberInStock === 0)
        return res.status(400).send("Movie out of the stock")


    //We are going to need the concept of transactions

    const session = await Rental.startSession();
    if(!session){
        return res.status(500).send("Internal Server Error: Unable to start a database transaction")
    }

    session.startTransaction();

    const newRental = new Rental({
        customer: {
            _id: foundCustomer._id,
            name: foundCustomer.name,
            phone:  foundCustomer.phone
        },
        movie: {
            _id: foundMovie._id,
            title: foundMovie.title,
            dailyRentalRate: foundMovie.dailyRentalRate,
        }
    })

    try {

        await newRental.save({session})

        foundMovie.numberInStock--;
        await foundMovie.save({session})
        await session.commitTransaction()
    } catch (err){
        await session.abortTransaction();
        res.status(500).send("Something failed in the middle")
    } finally {
        await session.endSession();
        res.send(newRental)
    }

})


module.exports = router