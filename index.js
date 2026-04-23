const express = require('express');
const cors = require('cors');
const { computeScore } = require('./scoring');

const app = express();
app.use(cors());
app.use(express.json());

// Health check - so we can test the server is alive
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'delegate-api', version: '0.1.0' });
});

// Main endpoint - receives signals, returns a score
app.post('/v1/verify', (req, res) => {
  const signals = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  const result = computeScore(signals, ip);
  
  console.log('Verification request:', { ip, signals, result });
  
  res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Delegate API running on port ${PORT}`);
});