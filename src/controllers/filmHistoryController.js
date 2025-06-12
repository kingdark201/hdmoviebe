const FilmHistory = require('../models/filmHistoryModel');

class FilmHistoryController {
    async upsertHistory(req, res) {
        try {
            const user_id = req.user && req.user.id ? req.user.id : null;
            if (!user_id) return res.json({ status: 'error', message: 'Người dùng chưa đăng nhập' });
            const { title, thumb, episode, total_episodes, server, progress, slug, embeb } = req.body;
            if (!title || 
                !thumb || 
                episode == null || 
                total_episodes == null || 
                !server || 
                progress == null || 
                !slug || 
                !embeb) {
                return res.json({ status: 'error', message: 'Thiếu các trường bắt buộc' });
            }
            let history = await FilmHistory.findOne({ user_id, slug });
            if (history) {
                history.episode = episode;
                history.progress = progress;
                history.embeb = embeb;
                await history.save();
                return res.json({ status: 'success', data: history, message: 'Đã cập nhật vào lịch sử xem' });
            }
            history = new FilmHistory({ user_id, title, thumb, episode, total_episodes, server, progress, slug, embeb });
            await history.save();
            res.json({ status: 'success', data: history, message: 'Đã thêm vào lịch sử xem' });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }

    async deleteHistory(req, res) {
        try {
            const user_id = req.user && req.user.id ? req.user.id : null;
            if (!user_id) return res.json({ status: 'error', message: 'Người dùng chưa đăng nhập' });
            const { slug } = req.params; 
            if (!slug) return res.json({ status: 'error', message: 'Không tìm thấy phim cần xóa' });
            const history = await FilmHistory.findOneAndDelete({ user_id, slug });
            if (!history) return res.json({ status: 'error', message: 'Không tìm thấy phim cần xóa' });
            res.json({ status: 'success', message: 'Đã xóa' });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }

    async getHistory(req, res) {
        try {
            const user_id = req.user && req.user.id ? req.user.id : null;
            if (!user_id) return res.json({ status: 'error', message: 'Người dùng chưa đăng nhập' });
            const histories = await FilmHistory.find({ user_id }).sort({ updatedAt: -1 });
            res.json({ status: 'success', data: histories });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }
}

module.exports = new FilmHistoryController();
