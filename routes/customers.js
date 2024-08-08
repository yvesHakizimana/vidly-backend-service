const express = require('express');
const router = express.Router();
const {Customer, validate } = require('../models/customer');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    const customers = await Customer
        .find()
        .sort('name')
        .select('name phone')
    if(customers.length > 0) {
        return res.status(200).json(customers);
    }
    res.status(200).send("No records found")

})

router.get('/:id', async (req, res) => {
    const foundCustomer =  await Customer.findById(req.params.id);
    if(!foundCustomer)
        return res.status(404).send("No such genre found");
    res.send(foundCustomer);

})

router.post('/', auth,  async (req, res) => {
    const {error} = validate(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    let newCustomer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
    })
    try {
        newCustomer = await newCustomer.save()
        res.status(200).send(newCustomer);
    } catch (err){
        for(let field in err.errors)
            return res.status(400).send(err.errors[field]);
    }

})

router.put ('/:id', auth,  async (req, res) => {
    //Validate the request we are receiving from the client
    const {error} = validate(req.body)
    if(error)
       return res.status(400).send(error.details[0].message)

    //Lookup the customer by id and update him/her immediately
    const foundCustomer = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold }, { new: true })
    if(!foundCustomer)
        return res.status(404).send("No such customer with id " + parseInt(req.params.id));
    res.send(foundCustomer);
})

router.delete ('/:id', auth,  async (req, res) => {
    const foundCustomer = await Customer.findByIdAndDelete(req.params.id);
    if(!foundCustomer)
        return res.status(404).send("No such customer with id " + req.params.id);
    res.send(foundCustomer);
})

module.exports = router;