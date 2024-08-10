const winston =  require('../utils/logger');

module.exports = function(err, req, res, next) {
    winston.error(err.message, err)
    res.status(err.status || 500 ).send("Server error: " + err.message);
}