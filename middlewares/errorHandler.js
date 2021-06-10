module.exports = (error, req, res, next) => {
  const { statusCode = 500 } = error;
  res.status(statusCode).json({ message: error.message });

  next();
};
