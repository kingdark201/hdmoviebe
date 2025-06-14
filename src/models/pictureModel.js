const mongoose = require('mongoose');

const pictureSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    thumb: { type: String, required: true }
}, { timestamps: true });

const Picture = mongoose.model('Picture', pictureSchema);

module.exports = Picture;
