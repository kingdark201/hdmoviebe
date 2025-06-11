const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

class UserController {
    async getUser(req, res) {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({status:404, message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({status:500, message: error.message });
        }
    }

    async addUser(req, res) {
        try {
            const { username, password, avatar } = req.body;
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ status: 400, message: 'Username already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, password: hashedPassword, avatar });
            await user.save();
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message });
        }
    }

    async editUser(req, res) {
        try {
            const userId = req.user.id;
            const updateData = {};

            if (Object.prototype.hasOwnProperty.call(req.body, 'username')) {
                updateData.username = req.body.username;
            }
            if (Object.prototype.hasOwnProperty.call(req.body, 'avatar')) {
                updateData.avatar = req.body.avatar;
            }
            if (Object.prototype.hasOwnProperty.call(req.body, 'password')) {
                const password = req.body.password;
                if (typeof password === 'string' && password.length > 0) {
                    updateData.password = await bcrypt.hash(password, 10);
                }
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ status: 400, message: 'No valid fields to update' });
            }

            const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
            if (!user) return res.status(404).json({ status: 404, message: 'User not found' });
            res.json(user);
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const userId = req.user.id;
            const user = await User.findByIdAndDelete(userId);
            if (!user) return res.status(404).json({ status: 404, message: 'User not found' });
            res.json({ message: 'User deleted' });
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) return res.status(400).json({ status: 400, message: 'Invalid credentials' });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ status: 400, message: 'Invalid credentials' });
            const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
            res.json({
                token,
                user: {
                    id: user._id,
                    username: user.username
                }
            });
        } catch (error) {
            res.status(500).json({ status: 500, message: error.message });
        }
    }

    async logout(req, res) {
        res.json({ message: 'Logged out' });
    }
}

module.exports = new UserController();