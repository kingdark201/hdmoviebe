const FilmFavorite = require('../models/filmFavoriteModel');

class FilmFavoriteController {
    async addFavorite(req, res) {
        try {
            const user_id = req.user && req.user.id ? req.user.id : null;
            if (!user_id) return res.json({ status: 'error', message: 'Người dùng chưa đăng nhập' });
            const { title, thumb, total_episodes,slug} = req.body;
            if (!title || !thumb || total_episodes == null || !slug) {
                return res.json({ status: 'error', message: 'Thiếu các trường bắt buộc' });
            }
            const existed = await FilmFavorite.findOne({ user_id, slug });
            if (existed) {
                return res.json({ status: 'error', message: 'Phim đã có trong danh sách yêu thích' });
            }
            const favorite = new FilmFavorite({ user_id, title, thumb, total_episodes, slug});
            await favorite.save();
            res.json({ status: 'success', data: favorite, message: 'Đã thêm vào danh sách yêu thích' });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }

    async deleteFavorite(req, res) {
        try {
            const user_id = req.user && req.user.id ? req.user.id : null;
            if (!user_id) return res.json({ status: 'error', message: 'Người dùng chưa đăng nhập' });
            const { slug } = req.params; 
            if (!slug) return res.json({ status: 'error', message: 'Không tìm thấy phim cần xóa' });
            const favorite = await FilmFavorite.findOneAndDelete({ user_id, slug });
            if (!favorite) return res.json({ status: 'error', message: 'Không tìm thấy phim cần xóa' });
            res.json({ status: 'success', message: 'Đã xóa khỏi danh sách yêu thích' });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }

    async getFavorite(req, res) {
        try {
            const user_id = req.user && req.user.id ? req.user.id : null;
            if (!user_id) return res.json({ status: 'error', message: 'Người dùng chưa đăng nhập' });
            const favorites = await FilmFavorite.find({ user_id }).sort({ updatedAt: -1 });
            res.json({ status: 'success', data: favorites });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }
}

module.exports = new FilmFavoriteController();

