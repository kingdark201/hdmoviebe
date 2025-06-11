const mongoose = require('mongoose');

const filmHistorySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    thumb: { type: String, required: true },
    episode: { type: Number, required: true },
    total_episodes: { type: Number, required: true },
    server: { type: String, required: true },
    progress: { type: Number, required: true }
}, { timestamps: true });

const FilmHistory = mongoose.model('FilmHistory', filmHistorySchema);

module.exports = FilmHistory;
