const mongoose = require('mongoose');

const filmFavoriteSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    thumb: { type: String, required: true },
    total_episodes: { type: Number, required: true },
    slug: { type: String, required: true },
}, { timestamps: true });

const FilmFavorite = mongoose.model('FilmFavorite', filmFavoriteSchema);

module.exports = FilmFavorite;
