const FilmHistory = require('../models/filmHistoryModel');

class FilmHistoryController {
    async upsertHistory(req, res) {
        try {
            const user_id = req.user && req.user.id ? req.user.id : null;
            if (!user_id) return res.status(401).json({ status: 401, message: 'User not authenticated' });
            const { title, thumb, episode, total_episodes, server, progress, slug } = req.body;
            if (!title || !thumb || episode == null || total_episodes == null || !server || progress == null || !slug) {
                return res.status(400).json({ status: 400, message: 'Missing required fields' });
            }
            // Kiểm tra tồn tại theo user_id + slug
            let history = await FilmHistory.findOne({ user_id, slug });
            if (history) {
                // Chỉ update các trường episode và progress, trường khác giữ nguyên
                history.episode = episode;
                history.progress = progress;
                await history.save();
                return res.json({ status: 200, data: history, message: 'History updated' });
            }
            // Nếu chưa có thì tạo mới
            history = new FilmHistory({ user_id, title, thumb, episode, total_episodes, server, progress, slug });
            await history.save();
            res.status(201).json({ status: 201, data: history, message: 'History added' });
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message });
        }
    }

    async deleteHistory(req, res) {
        try {
            const user_id = req.user && req.user.id ? req.user.id : null;
            if (!user_id) return res.status(401).json({ status: 401, message: 'User not authenticated' });
            const { id } = req.params;
            const history = await FilmHistory.findOneAndDelete({ _id: id, user_id });
            if (!history) return res.status(404).json({ status: 404, message: 'History not found' });
            res.json({ status: 200, message: 'History deleted' });
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message });
        }
    }

    async getHistory(req, res) {
        try {
            const user_id = req.user && req.user.id ? req.user.id : null;
            if (!user_id) return res.status(401).json({ status: 401, message: 'User not authenticated' });
            const histories = await FilmHistory.find({ user_id }).sort({ updatedAt: -1 });
            res.json({ status: 200, data: histories });
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message });
        }
    }
}

module.exports = new FilmHistoryController();
