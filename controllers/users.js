const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError, BadRequestError } = require('../errors');

module.exports.getUsers = (req, res) => {
  User.find({}).then((users) => {
    res.send(users);
  });
};

module.exports.addUser = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  if (!validator.isEmail(email)) {
    return next(new BadRequestError('Некорректно заполнен email'));
  }

  return bcrypt.hash(password, 10).then((hash) => {
    User.create({
      email,
      password: hash,
    })
      .then((user) => {
        res.status(201).send({
          _id: user._id,
          email: user.email,
        });
      }).catch((err) => {
        next(err);
      });
  }).catch((err) => {
    next(err);
  });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { ...req.body }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ user }))
    .catch((err) => {
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar: req.body.avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ user }))
    .catch((err) => {
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('Неправильный логин или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((mathed) => {
          if (!mathed) {
            return Promise.reject(new BadRequestError('Неправильный логин или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, 'super-secret-key', { expiresIn: '7d' });
          return res.cookie('authorization', `Bearer ${token}`, { httpOnly: true, sameSite: true }).send(`Bearer ${token}`);
        }).catch((err) => {
          next(err);
        });
    }).catch((err) => {
      next(err);
    });
};

module.exports.currentUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      res.status(201).send(user);
    }).catch((err) => {
      next(err);
    });
};
