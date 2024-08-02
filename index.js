const express = require('express')
const app = express()
const mongoose = require('mongoose')
const genres = require('./routes/genres')

app.use(express.json());

mongoose.connect('mongodb://localhost/vidly-backend')
    .then(() => console.log("Connected to mongoDb"))
    .catch(err => console.error("Could not connect to mongoDb", err));

const PORT = process.env.PORT || 4000;



app.use('/api/genres', genres);


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

