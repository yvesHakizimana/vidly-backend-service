const express = require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('config')
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const auth  = require('./routes/auth')

app.use(express.json());

//Checking if the jwt private key is defined.
if(!config.get('jwtPrivateKey')){
    console.error("Jwt private key is not defined")
    process.exit(1)
}

mongoose.connect('mongodb://localhost/vidly-backend')
    .then(() => console.log("Connected to mongoDb"))
    .catch(err => console.error("Could not connect to mongoDb", err));

const PORT = process.env.PORT || 4001;

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals)
app.use('/api/users', users)
app.use('/api/auth', auth)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

