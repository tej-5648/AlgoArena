const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');
const cors = require('cors');

// Connect to TimescaleDB
const db = new Pool({
    connectionString: 'postgresql://postgres:IHrMJueUuTnAsIrXVBkYmdequKOAvQoU@kodama.proxy.rlwy.net:20736/railway'
});
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// API endpoint - get leaderboard data
app.get('/api/leaderboard', async (req, res) => {
    const result = await db.query(`
        SELECT
            bot_id,
            COUNT(*) as total_orders,
            ROUND(AVG(latency_us)) as avg_latency,
            MIN(latency_us) as best_latency,
            MAX(latency_us) as worst_latency
        FROM latency_metrics
        GROUP BY bot_id
        ORDER BY avg_latency ASC
    `);
    res.json(result.rows);
});

// Send live updates every 2 seconds
setInterval(async () => {
    const result = await db.query(`
        SELECT
            bot_id,
            COUNT(*) as total_orders,
            ROUND(AVG(latency_us)) as avg_latency,
            MIN(latency_us) as best_latency,
            MAX(latency_us) as worst_latency
        FROM latency_metrics
        GROUP BY bot_id
        ORDER BY avg_latency ASC
    `);
    io.emit('leaderboard_update', result.rows);
}, 2000);

// Start server
server.listen(3000, () => {
    console.log('[+] Backend server running at http://localhost:3000');
    console.log('[+] Leaderboard API: http://localhost:3000/api/leaderboard');
});