const express = require('express');
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/add', auth, commentController.addComment);
router.delete('/delete/:id', auth, commentController.deleteComment);
router.get('/by-slug/:slug', commentController.getCommentBySlug);

module.exports = router;
