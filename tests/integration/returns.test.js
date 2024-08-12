const {Rental} = require('../../models/rental')
const { User} = require('../../models/user')
const mongoose = require("mongoose");
const request = require("supertest");
const {Movie} = require("../../models/movie");
const moment = require("moment")

describe('/api/returns', () => {
    let server
    let movieId
    let customerId
    let rental
    let token
    let movie

    beforeEach(async () => {
        token = new User().generateAuthToken()
        server = require('../../index');
        customerId = new mongoose.Types.ObjectId()
        movieId = new mongoose.Types.ObjectId()
        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345',
            },
            movie: {
                _id: movieId,
                title: 'movie title',
                dailyRentalRate: 2,
            }
        })

        movie = new Movie({
            _id: movieId,
            title: 'movie title',
            dailyRentalRate: 2,
            numberInStock: 10,
            genre: {
                name: '12345'
            }
        })

        await rental.save();
        await movie.save()
    })

    afterEach(async () => {
        await server.close()
        await Rental.deleteMany()
        await Movie.deleteMany()
    })

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({customerId, movieId})
    }

    it('should return 401 if the client is not logged in', async () => {
       token = ''
       const res = await exec()

       expect(res.status).toBe(401)
    })

    it('should return 400 if the customerId is not provided', async () => {
        customerId = ''
        const res = await exec()

        expect(res.status).toBe(400)
    })

    it('should return 400 if the movieId is not provided', async () => {
        movieId = ''
        const res = await exec()

        expect(res.status).toBe(400)
    })

    it('should return 404 if no rental found for this customer/movieId both present', async () => {
        await Rental.deleteMany()

        const res = await exec()
        expect(res.status).toBe(404)
    });

    it('should return 400 if the return is already processed', async () => {
        rental.dateReturned = new Date()
        await rental.save()

        const res = await exec()
        expect(res.status).toBe(400)
    })

    it('should return 200 if it is a valid request', async () => {
        const res = await exec()

        expect(res.status).toBe(200)
    });

    it('should set the return date if the input is valid', async () => {
        const res = await exec()

        const rentalInDb = await Rental.findById(rental._id)
        const diff = new Date() - rentalInDb.dateReturned
        expect(diff).toBeLessThan(5 * 1000)
    });

    it('should calculate the rental fee if the input is valid', async() => {
        const res = await exec()

        const rentalInDb = await Rental.findById(rental._id)
        const dailyRentalRate = rentalInDb.movie.dailyRentalRate;
        const rentalDays = Math.floor((rentalInDb.dateReturned - rentalInDb.dateOut)/ (1000 * 60 * 60 * 24));


        expect(rentalInDb.rentalFee).toBe(dailyRentalRate * rentalDays)
    })

    it('should increase the number of movies in the stock if input is valid', async() => {
        const res = await exec();

        const movieInDb = await Movie.findById(movieId)

        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    })

    it('should return the rental if input is valid', async() => {
        const res = await exec()

        const rentalInDb = await Rental.findById(rental._id)
        expect(res.body).toHaveProperty('dateReturned')
        expect(res.body).toHaveProperty('movie')
        expect(res.body).toHaveProperty('customer')
        expect(res.body).toHaveProperty('rentalFee')

        expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
            'dateReturned', 'dateOut', 'movie', 'customer', 'rentalFee'
        ]))
    })
});