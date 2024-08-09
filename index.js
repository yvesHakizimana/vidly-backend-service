require('express-async-errors')
const express = require('express')
const app = express()
const config = require('config')
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const winston = require('./utils/logger');
const {modifiers: ex} = require("@hapi/joi/lib/types/any");


require('./startup/routes')(app)
require('./startup/db')()

process.on('uncaughtException', ex => {
    winston.error(ex.message, ex);
    process.exit(1)
})

process.on('unhandledRejection', err => {
    winston.error(err.message, err);
    process.exit(1)
})

//Checking if the jwt private key is defined.
if(!config.get('jwtPrivateKey')){
    console.error("Jwt private key is not defined")
    process.exit(1)
}

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

