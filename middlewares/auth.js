const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');

const { JWT_SECRET = 'super-secret-key' } = process.env;

module.exports = (req, res, next) => {
  let { authorization } = req.cookies;
  if (!authorization) {
    authorization = req.headers.authorization;
  }
  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new UnauthorizedError('Необходимо авторизоваться'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload = '';
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Необходимо авторизоваться'));
  }

  req.user = payload;
  return next();
};
