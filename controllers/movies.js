const Movie = require('../models/movie');
const { ForbiddenError, NotFoundError } = require('../errors');

function getAllMovies(req, res, next) {
  return Movie.find({owner: req.user._id}).then((movies) => {
    res.send(movies);
  }).catch(next);
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
    owner: req.user._id,
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

async function deleteMovie(req, res, next) {
  const findedMovie = await Movie.findById(req.params.id);
  if (!findedMovie) {
    return next(new NotFoundError('Карточка не найдена'));
  }

  if (findedMovie.owner.toString().toLowerCase() !== req.user._id.toLowerCase()) {
    return next(new ForbiddenError('Нельзя удалять карточку другого пользователя'));
  }

  const deletedMovie = await findedMovie.delete();
  return res.json(deletedMovie);
}

module.exports = {
  getAllMovies,
  addMovie,
  deleteMovie,
};
