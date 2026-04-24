// Database setup - Postgres via Railway
// Creates a `verifications` table that logs every signal payload and score.
// If DATABASE_URL isn't set, we fall back to in-memory storage so the server still runs.

const { Pool } = require('pg');

let pool = null;
let inMemoryStore = [];

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  pool.on('error', (err) => {
    console.error('Unexpected DB error:', err);
  });
}

async function initDatabase() {
  if (!pool) {
    console.log('No DATABASE_URL set — using in-memory storage. Data will not persist across restarts.');
    return;
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS verifications (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ip TEXT,
        user_agent TEXT,
        fingerprint TEXT,
        signals JSONB NOT NULL,
        score INTEGER NOT NULL,
        verdict TEXT NOT NULL,
        reasons JSONB NOT NULL
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_verifications_created_at ON verifications (created_at DESC);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_verifications_fingerprint ON verifications (fingerprint);
    `);

    console.log('Database initialized.');
  } catch (err) {
    console.error('Database init failed:', err);
  }
}

async function saveVerification({ ip, userAgent, fingerprint, signals, score, verdict, reasons }) {
  if (!pool) {
    // Fallback to in-memory
    inMemoryStore.unshift({
      id: Date.now(),
      created_at: new Date().toISOString(),
      ip,
      user_agent: userAgent,
      fingerprint,
      signals,
      score,
      verdict,
      reasons
    });
    // Keep only last 500 in memory
    if (inMemoryStore.length > 500) inMemoryStore = inMemoryStore.slice(0, 500);
    return;
  }

  try {
    await pool.query(
      `INSERT INTO verifications (ip, user_agent, fingerprint, signals, score, verdict, reasons)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [ip, userAgent, fingerprint, JSON.stringify(signals), score, verdict, JSON.stringify(reasons)]
    );
  } catch (err) {
    console.error('Failed to save verification:', err);
  }
}

async function getRecentVerifications(limit = 100) {
  if (!pool) {
    return inMemoryStore.slice(0, limit);
  }

  try {
    const result = await pool.query(
      `SELECT id, created_at, ip, user_agent, fingerprint, signals, score, verdict, reasons
       FROM verifications
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  } catch (err) {
    console.error('Failed to fetch verifications:', err);
    return [];
  }
}

async function countFingerprintSeen(fingerprint) {
  if (!fingerprint) return 0;

  if (!pool) {
    return inMemoryStore.filter(v => v.fingerprint === fingerprint).length;
  }

  try {
    const result = await pool.query(
      `SELECT COUNT(*)::int AS count FROM verifications WHERE fingerprint = $1`,
      [fingerprint]
    );
    return result.rows[0].count;
  } catch (err) {
    console.error('Failed to count fingerprint:', err);
    return 0;
  }
}

async function getStats() {
  if (!pool) {
    const total = inMemoryStore.length;
    const blocked = inMemoryStore.filter(v => v.verdict === 'block').length;
    const challenged = inMemoryStore.filter(v => v.verdict === 'challenge').length;
    const allowed = inMemoryStore.filter(v => v.verdict === 'allow').length;
    return { total, blocked, challenged, allowed };
  }

  try {
    const result = await pool.query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE verdict = 'block')::int AS blocked,
        COUNT(*) FILTER (WHERE verdict = 'challenge')::int AS challenged,
        COUNT(*) FILTER (WHERE verdict = 'allow')::int AS allowed
      FROM verifications
      WHERE created_at > NOW() - INTERVAL '30 days'
    `);
    return result.rows[0];
  } catch (err) {
    console.error('Failed to fetch stats:', err);
    return { total: 0, blocked: 0, challenged: 0, allowed: 0 };
  }
}

module.exports = {
  initDatabase,
  saveVerification,
  getRecentVerifications,
  countFingerprintSeen,
  getStats
};
