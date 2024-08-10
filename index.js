const express = require('express')
const app = express()
const winston = require('./utils/logger');
const {modifiers: ex} = require("@hapi/joi/lib/types/any");

require('express-async-errors')
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/validation')()

process.on('uncaughtException', ex => {
    winston.error(ex.message, ex);
    process.exit(1)
})

process.on('unhandledRejection', err => {
    winston.error(err.message, err);
    process.exit(1)
})

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => winston.info(`Listening on port ${PORT}`));

module.exports = server
