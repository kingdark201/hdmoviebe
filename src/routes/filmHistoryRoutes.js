const express = require('express');
const filmHistoryController = require('../controllers/filmHistoryController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/add', auth, filmHistoryController.addHistory);
router.put('/edit/:id', auth, filmHistoryController.editHistory);
router.delete('/delete/:id', auth, filmHistoryController.deleteHistory);
router.get('/get', auth, filmHistoryController.getHistory);

module.exports = router;
