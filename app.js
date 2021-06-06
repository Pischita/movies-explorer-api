const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
require('dotenv').config();
const { NotFoundError } = require('./errors');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const userController = require('./controllers/users');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(helmet());
app.disable('x-powered-by');
app.use(cookieParser());
app.use(requestLogger);
const { PORT = 3000, DB_NAME = 'bitfilmsdb' } = process.env;

mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use('/users', userRouter);
app.use('/movies', movieRouter);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), userController.login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), userController.addUser);

app.post('/signout', (req, res) => {
  res.clearCookie('authorization').end();
});

app.use('*', (req, res, next) => {
  next(new NotFoundError('Вызван неизвестный метод'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.use('/users', userRouter);

app.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Work on port  ${PORT}`);
});
