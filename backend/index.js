require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./utils/db');

// Import routes
const authRoutes = require('./routes/auth');
const backupRoutes = require('./routes/backup');
const restoreRoutes = require('./routes/restore');
const floorRoutes = require('./routes/floor');
const aiRoutes = require('./routes/ai');
const statusRoutes = require('./routes/status');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT',
        'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type',
        'Authorization']
}));
app.use(express.json());

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/restore', restoreRoutes);
app.use('/api/floors', floorRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/status', statusRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'operational',
        service: 'MediShield DR',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Initialize connection and start server
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`[Server] MediShield DR backend running on port ${PORT}`);

        // Start background scheduler only after DB & Server are up
        require('./utils/scheduler');
    });
};

startServer();
