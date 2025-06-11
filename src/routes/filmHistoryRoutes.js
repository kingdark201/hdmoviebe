const express = require('express');
const filmHistoryController = require('../controllers/filmHistoryController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/upsert', auth, filmHistoryController.upsertHistory);
router.delete('/delete/:slug', auth, filmHistoryController.deleteHistory);
router.get('/get', auth, filmHistoryController.getHistory);

module.exports = router;
