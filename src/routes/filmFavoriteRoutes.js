const express = require('express');
const filmFavoriteController = require('../controllers/filmFavoriteController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/add', auth, filmFavoriteController.addFavorite);
router.delete('/delete/:slug', auth, filmFavoriteController.deleteFavorite);
router.get('/get', auth, filmFavoriteController.getFavorite);

module.exports = router;
