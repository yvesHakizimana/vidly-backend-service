const config = require('config')


module.exports = function() {
    //Checking if the jwt private key is defined.
    if(!config.get('jwtPrivateKey')){
       throw new Error("Jwt private key is not defined")
    }
}

