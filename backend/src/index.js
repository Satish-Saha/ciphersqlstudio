require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectMongo = require('./config/db');
const { connectPostgres } = require('./config/postgres');

const assignmentRoutes = require('./routes/assignments');
const queryRoutes = require('./routes/query');
const hintRoutes = require('./routes/hint');
const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'CipherSQLStudio API running' });
});

// Routes
app.use('/api/assignments', assignmentRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/hint', hintRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

// Start server
const startServer = async () => {
    await connectMongo();
    await connectPostgres();
    app.listen(PORT, () => {
        console.log(`\n🚀 CipherSQLStudio API running on http://localhost:${PORT}`);
    });
};

startServer();
