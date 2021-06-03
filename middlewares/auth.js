const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');

module.exports = (req, res, next) => {
  const { authorization } = req.cookies;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new UnauthorizedError('Необходимо авторизоваться'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload = '';
  try {
    payload = jwt.verify(token, 'super-secret-key');
  } catch (err) {
    return next(new UnauthorizedError('Необходимо авторизоваться'));
  }

  req.user = payload;
  return next();
};
