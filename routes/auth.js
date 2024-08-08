const express = require('express');
const router = express.Router();
const { User} = require('../models/user');
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require('config')

router.post('/', async (req, res) => {
    //Validating the request in general
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Validating the username
    let user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).send("Invalid email or password")

    //Validating the password
    const passwordValid = await bcrypt.compare(req.body.password, user.password)
    if(!passwordValid) return res.status(400).send("Invalid email or password")

    //generating authentication token
    const token = jwt.sign({ _id: user._id}, config.get('jwtPrivateKey'));

    res.send(token)
})

function validate(user){
    const userSchema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    })
    return userSchema.validate(user)
}

module.exports = router

