const express = require('express')
const app = express()
const genres = require('./routes/genres')



app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use('/api/genres', genres);


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

