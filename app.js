const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
require('dotenv').config();
const { NotFoundError } = require('./errors');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(helmet());
app.disable('x-powered-by');
app.use(cookieParser());
app.use(requestLogger);
const { PORT = 3000, DB_NAME = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

mongoose.connect(DB_NAME, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use(router);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Вызван неизвестный метод'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Work on port  ${PORT}`);
});
