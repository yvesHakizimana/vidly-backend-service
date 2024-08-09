const mongoose = require("mongoose");
const winston = require('../utils/logger');

module.exports = function() {
    mongoose.connect('mongodb://localhost/vidly-backend')
        .then(() => winston.info("Connected to mongoDb"))
}
