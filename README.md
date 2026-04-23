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
  "mouseMovements": 42
}
```

**Response:**
```json
{
  "score": 15,
  "verdict": "allow",
  "reasons": [],
  "timestamp": "2026-04-23T21:00:00Z"
}
```

## Running locally

```bash
npm install
npm start
```

Server runs on port 3000.

## Status

Early-stage. Expanding signals and scoring over time.