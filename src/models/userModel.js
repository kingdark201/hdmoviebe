const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String,required: true},
    avatar: {type: String,required: false, default: 'https://tte.edu.vn/public/upload/2025/01/avatar-dep44.webp' },
    password: {type: String,required: true},
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;