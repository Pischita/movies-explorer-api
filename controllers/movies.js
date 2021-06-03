const Movie = require('../models/movie');

function getAllMovies(req, res) {
  return Movie.find({}).then((movies) => {
    res.send(movies);
  });
}

function addMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.status(201).send(movie);
    }).catch((err) => {
      next(err);
    });
}

module.exports = {
  getAllMovies,
  addMovie,
};
