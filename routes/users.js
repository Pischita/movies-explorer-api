const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userController = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/', auth, userController.getUsers);

router.get('/me', auth, userController.currentUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email(),
  }),
}), auth, userController.updateUserInfo);

module.exports = router;
