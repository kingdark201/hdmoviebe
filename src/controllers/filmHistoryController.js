const FilmHistory = require('../models/filmHistoryModel');

class FilmHistoryController {
    async addHistory(req, res) {
        try {
            const user_id = req.user && req.user.id ? req.user.id : null;
            if (!user_id) return res.status(401).json({ status: 401, message: 'User not authenticated' });
            const { title, thumb, episode, total_episodes, server, progress } = req.body;
            if (!title || !thumb || episode == null || total_episodes == null || !server || progress == null) {
                return res.status(400).json({ status: 400, message: 'Missing required fields' });
            }
            // Nếu đã có lịch sử cho user + title + server thì update, không thì tạo mới
            let history = await FilmHistory.findOne({ user_id, title, server });
            if (history) {
                history.episode = episode;
                history.total_episodes = total_episodes;
                history.thumb = thumb;
                history.progress = progress;
                await history.save();
                return res.json({ status: 200, data: history });
            }
            history = new FilmHistory({ user_id, title, thumb, episode, total_episodes, server, progress });
            await history.save();
            res.status(201).json({ status: 201, data: history });
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message });
        }
    }

    async editHistory(req, res) {
        try {
            const user_id = req.user && req.user.id ? req.user.id : null;
            if (!user_id) return res.status(401).json({ status: 401, message: 'User not authenticated' });
            const { id } = req.params;
            const updateData = {};
            ['episode', 'progress'].forEach(field => {
                if (req.body[field] !== undefined) updateData[field] = req.body[field];
            });
            const history = await FilmHistory.findOneAndUpdate(
                { _id: id, user_id },
                updateData,
                { new: true }
            );
            if (!history) return res.status(404).json({ status: 404, message: 'History not found' });
            res.json({ status: 200, data: history });
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
