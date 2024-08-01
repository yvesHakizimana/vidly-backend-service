const Joi = require('joi')
const express = require('express')
const app = express()

const genres = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Horror' },
    { id: 3, name: 'Romance' },
];

app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get('/api/genres', (req, res) => {
    if(genres.length > 0)
        return res.send(genres);
    res.send("No genres present now");
})

app.post('/api/genres', (req, res) => {
    const {error } = validateGenre(req.body);
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    const newGenre = {
        id: genres.length + 1,
        name: req.body.name,
    }
    genres.push(newGenre);
    return res.send(newGenre);
})

app.put('/api/genres/:id', (req, res) => {
    //Validate the body request of the genre
    const {error} = validateGenre(req.body);
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    //Lookup the genre by Id
    const foundGenre = findGenreById(req.params.id);
    if(!foundGenre)
        return res.status(404).send("No such genre with id " + parseInt(req.params.id));req.params.id

    //Update the name of the genre
    foundGenre.name = req.body.name

    //then send the updated genre to the client
    res.send(foundGenre);

})

app.delete('/api/genres/:id', (req, res) => {
  const foundGenre = findGenreById(req.params.id);
  if(!foundGenre)
      return res.status(404).send("No such genre with id " + req.params.id);
  const indexOfGenre  = genres.indexOf(foundGenre);
  genres.splice(indexOfGenre, 1);
  return res.send(foundGenre)
})


function validateGenre(genre) {
    const genreSchema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return genreSchema.validate(genre)
}

function findGenreById(genreId){
    return genres.find(genre => genre.id === parseInt(genreId))
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

