# Delegate API

Fraud detection API for signup flows. Receives device and behavioral signals from the Delegate SDK and returns a risk score.

## Endpoints

### `GET /`
Health check. Returns service status.

### `POST /v1/verify`
Accepts signal payload, returns risk score.

**Request body:**
```json
{
  "fingerprint": "abc123...",
  "webdriver": false,
  "formFillTimeMs": 8400,
  "mouseMovements": 42,
  "pasteEvents": 0
}
```

**Response:**
```json
{
  "score": 15,
  "verdict": "allow",
  "reasons": [],
  "timestamp": "2026-04-23T22:00:00Z"
}
```

### `GET /admin?token=YOUR_TOKEN`
Admin dashboard. Requires `ADMIN_TOKEN` env var set.

## Environment variables

- `DATABASE_URL` — Postgres connection string (optional, falls back to in-memory)
- `ADMIN_TOKEN` — token required to view /admin

## Running locally

```bash
npm install
npm start
```

Server runs on port 3000.
