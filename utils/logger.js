const winston = require('winston');
require('winston-mongodb')
const mongoose = require("mongoose");

let options = {
    db: mongoose.connection.useDb('logs_db'),
    options: { useUnifiedTopology: true },
    collection: 'logs',
    capped: false,
    expireAfterSeconds: 60 * 60 * 1000,
    leaveConnectionOpen: false,
    storeHost: false,
}

module.exports = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        new winston.format.timestamp(),
        new winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'logs/error.log', level: 'error'}),
        new winston.transports.MongoDB(options)
    ]
})