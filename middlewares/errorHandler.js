module.exports = (error, req, res, next) => {
  const { statusCode = 500 } = error;

  if (error.name === 'MongoError' && error.code === 11000) {
    res.status(409).json({ message: 'Пользователь c таким email уже существует' });
  } else if (error.name === 'CastError') {
    res.status(400).json({ message: 'Переданы некорректные данные' });
  } else if (error.message === 'NotFound') {
    res.status(404).json({ message: 'Карточка не найдена' });
  } else if (error.name === 'TypeError') {
    res.status(400).json({ message: 'Переданы некорректные данные' });
  } else if (error.message.startsWith('Validation failed')) {
    res.status(400).json({ message: error.message });
  } else if (/validation failed/i.test(error.message)) {
    res.status(400).json({ message: error.message });
  } else {
    res.status(statusCode).json({ message: error.message });
  }

  next();
};
