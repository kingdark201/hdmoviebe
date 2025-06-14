const Picture = require('../models/pictureModel');

class PictureController {
    async addPicture(req, res) {
        try {
            const user_id = req.user && req.user.id ? req.user.id : null;
            const { thumb } = req.body;
            if (!user_id) return res.json({ status: 'error', message: 'Người dùng chưa đăng nhập' });
            if (!thumb) return res.json({ status: 'error', message: 'Thiếu đường dẫn ảnh' });

            // Kiểm tra user đã có thumb này chưa
            const existed = await Picture.findOne({ user_id, thumb });
            if (existed) {
                return res.json({ status: 'error', message: 'Ảnh đã tồn tại' });
            }

            const picture = new Picture({ user_id, thumb });
            await picture.save();
            res.json({ status: 'success', data: picture, message: 'Đã thêm ảnh' });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }

    async deletePicture(req, res) {
        try {
            const user_id = req.user && req.user.id ? req.user.id : null;
            const { id } = req.params;
            if (!user_id) return res.json({ status: 'error', message: 'Người dùng chưa đăng nhập' });
            if (!id) return res.json({ status: 'error', message: 'Không tìm thấy ảnh' });
            const picture = await Picture.findOneAndDelete({ _id: id, user_id });
            if (!picture) return res.json({ status: 'error', message: 'Không tìm thấy ảnh hoặc không có quyền xóa' });
            res.json({ status: 'success', message: 'Đã xóa ảnh' });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }

    async getAllPictures(req, res) {
        try {
            const user_id = req.user && req.user.id ? req.user.id : null;
            if (!user_id) return res.json({ status: 'error', message: 'Người dùng chưa đăng nhập' });
            const pictures = await Picture.find({ user_id }).sort({ createdAt: -1 });
            res.json({ status: 'success', data: pictures });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }
}

module.exports = new PictureController();
