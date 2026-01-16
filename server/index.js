require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Log server instance info
console.log('='.repeat(60));
console.log(`[SERVER] Starting AI Goal Planner Backend`);
console.log(`[SERVER] Process ID: ${process.pid}`);
console.log(`[SERVER] Node Version: ${process.version}`);
console.log(`[SERVER] Port: ${PORT}`);
console.log(`[SERVER] Timestamp: ${new Date().toISOString()}`);
console.log('='.repeat(60));

app.use(cors());
app.use(express.json());

// Main API Routes
app.use('/api', apiRoutes);

// Health Check with instance info
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        pid: process.pid,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// MongoDB Connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('[SERVER] Connected to MongoDB'))
    .catch(err => console.error('[SERVER] MongoDB connection error:', err));
} else {
  console.log('[SERVER] MongoDB not configured — running in stateless mode');
}


app.listen(PORT, () => {
    console.log(`[SERVER] ✓ Server running on port ${PORT}`);
    console.log(`[SERVER] ✓ Health check: http://localhost:${PORT}/health`);
});
