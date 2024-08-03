const mongoose = require('mongoose')
const Joi = require('joi')

const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 30,
    },
    phone: {
        type: String,
        trim: true,
        minLength: 4,
        maxLength: 30,
    }
}))

function validateCustomer(customer){
    const customerSchema = Joi.object({
        name: Joi.string().min(4).max(30).required(),
        phone: Joi.string().min(4).max(30).required(),
        isGold: Joi.boolean()
    })
    return customerSchema.validate(customer)
}

exports.Customer = Customer;
exports.validate = validateCustomer;