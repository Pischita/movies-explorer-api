const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
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
    image: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }
      return helper.message('Передан некорректный URL для изображения');
    }),
    trailer: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }
      return helper.message('Передан некорректный URL для трейлера');
    }),
    thumbnail: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }
      return helper.message('Передан некорректный URL иконки');
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }).unknown(true),
}), movieController.addMovie);

router.delete('/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
}), movieController.deleteMovie);

module.exports = router;
