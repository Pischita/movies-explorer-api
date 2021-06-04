const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: (props) => `${props.value} Некорректный url для постера к фильму`,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: (props) => `${props.value} Некорректный url для трейлера к фильму`,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: (props) => `${props.value} Некорректный url для миниатюрного изображения`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },

});

module.exports = mongoose.model('movie', userSchema);
