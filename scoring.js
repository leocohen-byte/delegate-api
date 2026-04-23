// Takes signals from the SDK, returns a risk score 0-100
// Higher score = more suspicious

function computeScore(signals, ip) {
  const reasons = [];
  let score = 0;
  
  // Signal 1: Is the browser being controlled by automation?
  if (signals.webdriver === true) {
    score += 40;
    reasons.push('Automated browser detected (webdriver flag)');
  }
  
  // Signal 2: Form filled suspiciously fast?
  if (signals.formFillTimeMs !== undefined && signals.formFillTimeMs < 1500) {
    score += 30;
    reasons.push(`Form filled in ${signals.formFillTimeMs}ms - too fast for human`);
  }
  
  // Signal 3: No mouse movement at all?
  if (signals.mouseMovements !== undefined && signals.mouseMovements === 0) {
    score += 20;
    reasons.push('No mouse movement detected');
  }
  
  // Signal 4: Missing fingerprint?
  if (!signals.fingerprint) {
    score += 10;
    reasons.push('No device fingerprint available');
  }
  
  // Cap at 100
  score = Math.min(score, 100);
  
  // Verdict
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

module.exports = { computeScore };