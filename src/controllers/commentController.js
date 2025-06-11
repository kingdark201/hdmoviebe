const Comment = require('../models/commentModel');

class CommentController {
    async addComment(req, res) {
        try {
            const user_id = req.user && req.user.id ? req.user.id : null;
            if (!user_id) {
                return res.status(401).json({ message: 'User not authenticated' });
            }
            const { comment, slug_film } = req.body;
            if (!comment || !slug_film ) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            // Đảm bảo user_id là ObjectId
            const newComment = new Comment({ user_id, comment, slug_film });
            await newComment.save();
            res.status(201).json(newComment);
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message });
        }
    }

    async deleteComment(req, res) {
        try {
            const user_id = req.user.id;
            const commentId = req.params.id;
            const comment = await Comment.findById(commentId);
            if (!comment) return res.status(404).json({ status: 404, message: 'Comment not found' });
            if (comment.user_id.toString() !== user_id) {
                return res.status(403).json({ status: 403, message: 'Not authorized to delete this comment' });
            }
            await Comment.findByIdAndDelete(commentId);
            res.json({ message: 'Comment deleted' });
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message });
        }
    }

    async getCommentBySlug(req, res) {
        try {
            const { slug } = req.params;
            const comments = await Comment.find({ slug_film: slug })
                .populate({ path: 'user_id', select: 'username avatar' })
                .lean();

            const formatted = comments.map(c => {
                let userId = null, username = null, avatar = null;
                if (c.user_id && typeof c.user_id === 'object' && c.user_id._id) {
                    userId = c.user_id._id;
                    username = c.user_id.userusername;
                    avatar = c.user_id.avatar;
                } else if (typeof c.user_id === 'string' || typeof c.user_id === 'object') {
                    userId = c.user_id;
                }
                return {
                    user_id: userId,
                    username,
                    avatar,
                    comment: c.comment,
                    slug_film: c.slug_film,
                    createdAt: c.createdAt
                        ? new Date(c.createdAt).toLocaleTimeString('vi-VN', { hour12: false }) + ' ' +
                          new Date(c.createdAt).toLocaleDateString('vi-VN')
                        : null
                };
            });
            res.json(formatted);
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message });
        }
    }
}

module.exports = new CommentController();
