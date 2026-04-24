const express = require('express');
const cors = require('cors');
const { computeScore } = require('./scoring');
const {
  initDatabase,
  saveVerification,
  getRecentVerifications,
  countFingerprintSeen,
  getStats
} = require('./database');

const app = express();

// ============================================
// Middleware
// ============================================
app.use(cors({
  origin: true, // Allow all origins - this is a fraud detection API intended to be called from many sites
  credentials: false
}));
app.use(express.json({ limit: '100kb' }));

// Trust Railway's proxy headers so req.ip is correct
app.set('trust proxy', true);

// ============================================
// Admin auth middleware
// ============================================
function requireAdmin(req, res, next) {
  const token = req.query.token || req.headers['x-admin-token'];
  if (!process.env.ADMIN_TOKEN) {
    return res.status(500).json({ error: 'Admin access not configured (ADMIN_TOKEN env var missing)' });
  }
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ============================================
// Public endpoints
// ============================================

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'delegate-api',
    version: '0.2.0',
    endpoints: {
      verify: 'POST /v1/verify',
      admin: 'GET /admin?token=YOUR_TOKEN'
    }
  });
});

// Main verification endpoint
app.post('/v1/verify', async (req, res) => {
  const signals = req.body || {};
  const ip = req.ip || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'] || '';

  try {
    // Count returning fingerprint
    const fingerprintSeenCount = await countFingerprintSeen(signals.fingerprint);

    // Score it
    const result = computeScore(signals, { ip, fingerprintSeenCount, userAgent });

    // Save async — don't block the response
    saveVerification({
      ip,
      userAgent,
      fingerprint: signals.fingerprint || null,
      signals,
      score: result.score,
      verdict: result.verdict,
      reasons: result.reasons
    }).catch((err) => console.error('Save failed:', err));

    res.json(result);
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// ============================================
// Admin endpoints
// ============================================

// Admin JSON API - recent verifications
app.get('/admin/api/verifications', requireAdmin, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);
  const verifications = await getRecentVerifications(limit);
  res.json({ verifications });
});

// Admin JSON API - stats
app.get('/admin/api/stats', requireAdmin, async (req, res) => {
  const stats = await getStats();
  res.json(stats);
});

// Admin dashboard HTML
app.get('/admin', (req, res) => {
  const token = req.query.token || '';
  res.send(renderDashboard(token));
});

function renderDashboard(token) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Delegate Admin</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #07090f;
    --bg-alt: #0b0e17;
    --surface: #111623;
    --surface-hi: #161c2d;
    --border: #1d2438;
    --border-hi: #2a3352;
    --text: #f1f3f9;
    --text-mid: #b4bccd;
    --text-dim: #7683a0;
    --accent: #5b8eff;
    --ok: #3ddc97;
    --warn: #ffb454;
    --danger: #ff6b6b;
    --mono: "JetBrains Mono", ui-monospace, monospace;
  }
  body {
    font-family: "Inter", -apple-system, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 1400px; margin: 0 auto; padding: 32px 24px; }
  header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid var(--border); }
  h1 { font-size: 1.4rem; font-weight: 600; letter-spacing: -0.01em; }
  h1 .accent { color: var(--accent); font-weight: 500; }
  .muted { color: var(--text-dim); font-size: 0.85rem; }
  .token-box { padding: 20px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 24px; }
  .token-box input { background: var(--bg-alt); border: 1px solid var(--border); color: var(--text); padding: 10px 14px; border-radius: 8px; font-family: var(--mono); font-size: 0.9rem; width: 300px; }
  .token-box button { background: var(--accent); color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; margin-left: 8px; }
  .token-box button:hover { background: #7fa5ff; }
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px; }
  .stat { padding: 22px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; }
  .stat-label { color: var(--text-dim); font-size: 0.8rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
  .stat-value { font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; font-family: var(--mono); }
  .stat-value.ok { color: var(--ok); }
  .stat-value.warn { color: var(--warn); }
  .stat-value.danger { color: var(--danger); }
  .table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  .table-header { padding: 18px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .table-title { font-size: 0.95rem; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 14px 20px; text-align: left; font-size: 0.88rem; border-bottom: 1px solid var(--border); }
  th { background: var(--bg-alt); color: var(--text-dim); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--surface-hi); }
  .verdict { display: inline-block; padding: 4px 10px; border-radius: 6px; font-family: var(--mono); font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
  .verdict-allow { background: rgba(61, 220, 151, 0.12); color: var(--ok); }
  .verdict-challenge { background: rgba(255, 180, 84, 0.12); color: var(--warn); }
  .verdict-block { background: rgba(255, 107, 107, 0.12); color: var(--danger); }
  .score { font-family: var(--mono); font-weight: 600; }
  .reasons { color: var(--text-dim); font-size: 0.82rem; line-height: 1.5; max-width: 340px; }
  .mono { font-family: var(--mono); font-size: 0.82rem; color: var(--text-mid); }
  .empty { padding: 80px 20px; text-align: center; color: var(--text-dim); }
  .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid var(--border-hi); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 8px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .refresh-btn { background: transparent; color: var(--text-mid); border: 1px solid var(--border-hi); padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-family: inherit; }
  .refresh-btn:hover { background: var(--surface-hi); color: var(--text); }
</style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>Delegate <span class="accent">· Admin</span></h1>
      <p class="muted">Live verification log</p>
    </header>

    <div id="token-section" ${token ? 'style="display:none"' : ''} class="token-box">
      <p style="margin-bottom:12px;">Enter admin token to view dashboard:</p>
      <input type="password" id="token-input" placeholder="Admin token" />
      <button id="token-submit">Access dashboard</button>
    </div>

    <div id="dashboard" ${token ? '' : 'style="display:none"'}>
      <div class="stats">
        <div class="stat"><div class="stat-label">Total (30d)</div><div id="stat-total" class="stat-value">—</div></div>
        <div class="stat"><div class="stat-label">Allowed</div><div id="stat-allowed" class="stat-value ok">—</div></div>
        <div class="stat"><div class="stat-label">Challenged</div><div id="stat-challenged" class="stat-value warn">—</div></div>
        <div class="stat"><div class="stat-label">Blocked</div><div id="stat-blocked" class="stat-value danger">—</div></div>
      </div>

      <div class="table-wrap">
        <div class="table-header">
          <div class="table-title">Recent verifications</div>
          <button class="refresh-btn" id="refresh">Refresh</button>
        </div>
        <div id="table-body">
          <div class="empty"><span class="spinner"></span>Loading...</div>
        </div>
      </div>
    </div>
  </div>

<script>
let TOKEN = ${JSON.stringify(token)};

document.getElementById('token-submit').addEventListener('click', () => {
  const v = document.getElementById('token-input').value.trim();
  if (!v) return;
  window.location.href = '/admin?token=' + encodeURIComponent(v);
});

document.getElementById('token-input')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('token-submit').click();
});

async function loadStats() {
  try {
    const res = await fetch('/admin/api/stats?token=' + encodeURIComponent(TOKEN));
    if (!res.ok) throw new Error('Unauthorized');
    const s = await res.json();
    document.getElementById('stat-total').textContent = s.total || 0;
    document.getElementById('stat-allowed').textContent = s.allowed || 0;
    document.getElementById('stat-challenged').textContent = s.challenged || 0;
    document.getElementById('stat-blocked').textContent = s.blocked || 0;
  } catch (err) {
    alert('Invalid token or error loading stats');
    window.location.href = '/admin';
  }
}

async function loadVerifications() {
  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = '<div class="empty"><span class="spinner"></span>Loading...</div>';

  try {
    const res = await fetch('/admin/api/verifications?token=' + encodeURIComponent(TOKEN) + '&limit=100');
    if (!res.ok) throw new Error('Unauthorized');
    const data = await res.json();
    const rows = data.verifications || [];

    if (rows.length === 0) {
      tableBody.innerHTML = '<div class="empty">No verifications yet. Try the demo on testdelegate.com or POST to /v1/verify.</div>';
      return;
    }

    const html = [
      '<table>',
      '<thead><tr>',
      '<th>Time</th><th>Score</th><th>Verdict</th><th>IP</th><th>Fingerprint</th><th>Reasons</th>',
      '</tr></thead>',
      '<tbody>',
      ...rows.map(r => {
        const time = new Date(r.created_at).toLocaleString();
        const reasons = (Array.isArray(r.reasons) ? r.reasons : JSON.parse(r.reasons || '[]'))
          .map(x => '• ' + x).join('<br>');
        return \`<tr>
          <td class="mono">\${time}</td>
          <td class="score">\${r.score}</td>
          <td><span class="verdict verdict-\${r.verdict}">\${r.verdict}</span></td>
          <td class="mono">\${r.ip || '—'}</td>
          <td class="mono">\${r.fingerprint ? r.fingerprint.substring(0, 12) + '…' : '—'}</td>
          <td class="reasons">\${reasons || '—'}</td>
        </tr>\`;
      }),
      '</tbody></table>'
    ].join('');

    tableBody.innerHTML = html;
  } catch (err) {
    tableBody.innerHTML = '<div class="empty">Error loading. Token may be invalid.</div>';
  }
}

document.getElementById('refresh')?.addEventListener('click', () => {
  loadStats();
  loadVerifications();
});

if (TOKEN) {
  loadStats();
  loadVerifications();
  // Auto-refresh every 15 seconds
  setInterval(() => {
    loadStats();
    loadVerifications();
  }, 15000);
}
</script>
</body>
</html>`;
}

// ============================================
// Startup
// ============================================
const PORT = process.env.PORT || 3000;

(async () => {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Delegate API v0.2.0 running on port ${PORT}`);
  });
})();
