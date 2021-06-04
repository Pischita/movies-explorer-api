const Movie = require('../models/movie');
const { ForbiddenError, NotFoundError } = require('../errors');

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

function deleteMovie(req, res, next) {
  Movie.findByIdAndDelete(req.params.id)
    .orFail(new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (movie.owner.toString().toLowerCase() !== req.user._id.toLowerCase()) {
        throw new ForbiddenError('Нельзя удалять данные другого пользователя');
      }
      return res.send(movie);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getAllMovies,
  addMovie,
  deleteMovie,
};
