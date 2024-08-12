const express = require('express');
const router = express.Router();
const {Rental, validate } = require('../models/rental');
const auth = require('../middleware/auth');
const {Movie} = require("../models/movie");


router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body)
    if(error)
        return res.status(400).send(error.details[0].message);

    const {customerId, movieId } = req.body

    const rental = await Rental.findOne({
        'customer._id': customerId,
        'movie._id': movieId,
    })
    if(!rental)  return res.status(404).send('Rental not found.')

    if(rental.dateReturned) return res.status(400).send('Return already processed.')

    //Setting the dateReturned
    rental.dateReturned = Date.now()

    // Process the rental fee.
    const rental_days = Math.floor((rental.dateReturned - rental.dateOut) / (1000 * 60 * 60 * 24))
    rental.rentalFee = rental_days * rental.movie.dailyRentalRate;

    await rental.save()

    await Movie.findByIdAndUpdate(movieId, {
        $inc: { numberInStock: 1}
    })

    res.status(200).send(rental)

})

module.exports = router;