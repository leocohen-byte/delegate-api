// Scoring logic: turns signals into a risk score 0-100
// Higher score = more suspicious

function computeScore(signals, context = {}) {
  const reasons = [];
  let score = 0;
  const { ip, fingerprintSeenCount = 0, userAgent = '' } = context;

  // ============================================
  // Automation signals
  // ============================================
  if (signals.webdriver === true) {
    // Check if it looks like a legitimate AI agent (reasonable timing + some mouse)
    const looksLikeAgent =
      signals.formFillTimeMs !== undefined &&
      signals.formFillTimeMs > 2000 &&
      signals.mouseMovements !== undefined &&
      signals.mouseMovements > 5;

    if (looksLikeAgent) {
      score += 15;
      reasons.push('Automation detected with human-like timing (possible authorized AI agent)');
    } else {
      score += 40;
      reasons.push('Automated browser detected (webdriver flag)');
    }
  }

  // Known automation framework user agents
  if (userAgent && /HeadlessChrome|PhantomJS|Selenium|Puppeteer/i.test(userAgent)) {
    score += 25;
    reasons.push('User-agent matches automation framework');
  }

  // ============================================
  // Behavioral timing signals
  // ============================================
  if (signals.formFillTimeMs !== undefined) {
    if (signals.formFillTimeMs < 800) {
      score += 35;
      reasons.push(`Form filled in ${signals.formFillTimeMs}ms — far too fast for a human`);
    } else if (signals.formFillTimeMs < 1500) {
      score += 20;
      reasons.push(`Form filled in ${signals.formFillTimeMs}ms — suspiciously fast`);
    } else if (signals.formFillTimeMs < 3000) {
      score += 8;
      reasons.push(`Form filled in ${signals.formFillTimeMs}ms — on the fast end`);
    }
  }

  // ============================================
  // Mouse signals
  // ============================================
  if (signals.mouseMovements !== undefined) {
    if (signals.mouseMovements === 0 && signals.webdriver !== true) {
      score += 18;
      reasons.push('No mouse movement detected during form interaction');
    } else if (signals.mouseMovements < 3 && signals.formFillTimeMs > 500) {
      score += 10;
      reasons.push('Minimal mouse activity — inconsistent with typical human behavior');
    }
  }

  // ============================================
  // Paste behavior
  // ============================================
  if (signals.pasteEvents !== undefined && signals.pasteEvents >= 3) {
    score += 12;
    reasons.push(`${signals.pasteEvents} paste events — possible credential stuffing pattern`);
  }

  // ============================================
  // Fingerprint signals
  // ============================================
  if (!signals.fingerprint) {
    score += 10;
    reasons.push('No device fingerprint available');
  } else {
    // Returning device — sometimes bad, sometimes fine
    if (fingerprintSeenCount >= 5) {
      score += 25;
      reasons.push(`Device fingerprint seen ${fingerprintSeenCount} times before — possible multi-account abuse`);
    } else if (fingerprintSeenCount >= 2) {
      score += 8;
      reasons.push(`Device fingerprint seen ${fingerprintSeenCount} times before`);
    }
  }

  // ============================================
  // IP signals (placeholder — real IP reputation would go here)
  // ============================================
  if (ip && isLikelyDatacenter(ip)) {
    score += 20;
    reasons.push('Request from datacenter IP range');
  }

  // Cap at 100
  score = Math.min(score, 100);
  score = Math.max(score, 0);

  // Verdict thresholds
  let verdict;
  if (score >= 70) verdict = 'block';
  else if (score >= 40) verdict = 'challenge';
  else verdict = 'allow';

  return {
    score,
    verdict,
    reasons,
    timestamp: new Date().toISOString()
  };
}

// Very basic datacenter detection — real implementation would use an IP reputation API
function isLikelyDatacenter(ip) {
  if (!ip) return false;
  // Strip IPv6 prefix if present
  const cleanIp = ip.replace(/^::ffff:/, '');

  // Some common datacenter ranges (very incomplete — this is a placeholder)
  // Real implementation: call ipapi.is / ipqualityscore / ipinfo
  const datacenterPrefixes = [
    '34.', '35.', '104.', '108.', '130.', '139.', '142.',  // GCP, AWS, DO partial
    '13.', '20.', '40.', '52.',                             // Azure partial
    '3.', '18.', '54.'                                      // AWS partial
  ];

  // Don't flag private ranges as datacenter
  if (cleanIp.startsWith('10.') || cleanIp.startsWith('192.168.') || cleanIp.startsWith('172.') || cleanIp === '127.0.0.1' || cleanIp === '::1') {
    return false;
  }

  return datacenterPrefixes.some(prefix => cleanIp.startsWith(prefix));
}

module.exports = { computeScore };
