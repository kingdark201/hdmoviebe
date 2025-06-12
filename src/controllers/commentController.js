const Comment = require('../models/commentModel');
const User = require('../models/userModel');

class CommentController {
    async addComment(req, res) {
        try {
            const user_id = req.user && req.user.id ? req.user.id : null;
            if (!user_id) {
                return res.json({ status: 'error', message: 'Người dùng không xác thực' });
            }
            const { comment, slug_film } = req.body;
            if (!comment || !slug_film ) {
                return res.json({ status: 'error', message: 'Thiếu trường bắt buộc' });
            }

            const newComment = new Comment({ user_id, comment, slug_film });
            await newComment.save();
            res.json({status: 'success' ,data:newComment, message: 'Đã thêm 1 bình luận' });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }

    async deleteComment(req, res) {
        try {
            const user_id = req.user.id;
            const user = await User.findById(user_id);
            const user_role = user.role;
            const commentId = req.params.id;
            const comment = await Comment.findById(commentId);
            if (!comment) return res.json({ status: 'error', message: 'Bình luận không tồn tại' });

            if (user_role !== 'admin' && comment.user_id.toString() !== user_id) {
                return res.json({ status: 'error', message: 'Bạn không có quyền xóa bình luận này' });
            }

            await Comment.findByIdAndDelete(commentId);
            res.json({ status: 'success', message: 'Đã xóa 1 bình luận' });
        } catch (error) {
            res.json({ status: 400, message: error.message });
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
                    username = c.user_id.username; 
                    avatar = c.user_id.avatar;
                } else if (typeof c.user_id === 'string' || typeof c.user_id === 'object') {
                    userId = c.user_id;
                }
                return {
                    id: c._id, 
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
            res.json({ status: 'success', data: formatted });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }

    async getAllComment(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user || user.role !== 'admin') {
                return res.json({ status: 'error', message: 'Bạn không có quyền truy cập' });
            }
            const comments = await Comment.find()
                .populate({ path: 'user_id', select: 'username avatar' })
                .lean();

            const formatted = comments.map(c => {
                let userId = null, username = null, avatar = null;
                if (c.user_id && typeof c.user_id === 'object' && c.user_id._id) {
                    userId = c.user_id._id;
                    username = c.user_id.username; 
                    avatar = c.user_id.avatar;
                } else if (typeof c.user_id === 'string' || typeof c.user_id === 'object') {
                    userId = c.user_id;
                }
                return {
                    id: c._id, 
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
            res.json({ status: 'success', data: formatted });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }
}

module.exports = new CommentController();
