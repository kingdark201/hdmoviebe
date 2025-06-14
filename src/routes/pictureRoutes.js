const express = require('express');
const pictureController = require('../controllers/pictureController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/add', auth, pictureController.addPicture);
router.delete('/delete/:id', auth, pictureController.deletePicture);
router.get('/all', auth, pictureController.getAllPictures);

module.exports = router;
