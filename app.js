const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
app.use(express.json());

// ⚠️ SECRET LEAK - Industrial credentials exposed!
const SCADA_API_KEY = "sk_scada_prod_a1b2c3d4e5f6g7h8i9j0";
const PLC_PASSWORD = "Siemens_PLC_Admin_2024!";
const AWS_SECRET = "aws_secret_key_AKIAIOSFODNN7EXAMPLE";
// Additional API keys for testing
const GITHUB_TOKEN = "ghp_16C7e42F292c6912E7710c838347Ae178B4a";
const STRIPE_SECRET = "sk_live_4eC39HqLyjWDarjtT1zdp7dc";
const SLACK_WEBHOOK = "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX";
const OPENAI_KEY = "sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890";

// ⚠️ SQL Injection - Vulnerable equipment lookup
app.get('/equipment/:id', (req, res) => {
    const equipmentId = req.params.id;
    // Dangerous: Direct user input in query
    const query = `SELECT * FROM equipment WHERE id = ${equipmentId}`;
    res.json({ 
        query: query,
        message: "Equipment lookup for manufacturing floor"
    });
});

// ⚠️ XSS Vulnerability - Operator dashboard
app.get('/dashboard', (req, res) => {
    const operatorName = req.query.operator;
    // Dangerous: Unescaped user input in HTML
    res.send(`
        <html>
            <body>
                <h1>Manufacturing Dashboard</h1>
                <p>Logged in as: ${operatorName}</p>
            </body>
        </html>
    `);
});

// ⚠️ Using vulnerable lodash - Prototype pollution risk
app.post('/config', (req, res) => {
    const config = _.merge({}, req.body);
    res.json({ 
        message: "PLC configuration updated",
        config: config 
    });
});

// Sensor data endpoint
app.get('/sensors', (req, res) => {
    res.json({
        temperature: 72.5,
        pressure: 101.3,
        vibration: 0.05,
        status: "operational"
    });
});

// SCADA integration endpoint
app.post('/scada/alert', async (req, res) => {
    try {
        // Using hardcoded credentials (bad!)
        const response = await axios.post('https://scada.example.com/api', {
            apiKey: SCADA_API_KEY,
            alert: req.body
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health monitoring endpoint
app.get('/monitoring/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        plcs_connected: 50,
        alerts: 0,
        timestamp: new Date().toISOString()
    });
});

// Added basic logging for health check
console.log("Health check invoked");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Industrial IoT Gateway running on port ${PORT}`);
    console.log(`Monitoring 50 PLCs across production floor`);
});
