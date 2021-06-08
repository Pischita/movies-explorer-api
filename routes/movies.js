const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const movieController = require('../controllers/movies');
const auth = require('../middlewares/auth');

router.get('/', auth, movieController.getAllMovies);
router.post('/', auth, celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    trailer: Joi.string().required(),
    thumbnail: Joi.string().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), movieController.addMovie);

router.delete('/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
}), movieController.deleteMovie);

module.exports = router;
