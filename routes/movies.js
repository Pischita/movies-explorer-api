const router = require('express').Router();
const movieController = require('../controllers/movies');
const auth = require('../middlewares/auth');

router.get('/', auth, movieController.getAllMovies);
router.post('/', auth, movieController.addMovie);

module.exports = router;
