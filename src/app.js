require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');
const filmHistoryRoutes = require('./routes/filmHistoryRoutes');
const filmFavoriteRoutes = require('./routes/filmFavoriteRoutes');
const cors = require('cors'); // Thêm dòng này

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Thêm dòng này
app.use(express.json());

// Database connection
connectDB();

// Use the router directly
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/film-history', filmHistoryRoutes);
app.use('/api/film-favorite', filmFavoriteRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});