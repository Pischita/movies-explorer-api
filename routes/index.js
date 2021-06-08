const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const movieRouter = require('./movies');
const userRouter = require('./users');
const userController = require('../controllers/users');
const auth = require('../middlewares/auth');

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(2).required(),
  }),
}), userController.login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2),
    email: Joi.string().email().required(),
    password: Joi.string().min(2).required(),
  }),
}), userController.addUser);

router.post('/signout', (req, res) => {
  res.clearCookie('authorization').end();
});

router.get('/', auth, (req, res) => {
  res.status(200).end();
});

module.exports = router;
