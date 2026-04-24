/*!
 * Delegate SDK v0.1
 * Drop-in fraud detection for signup flows.
 *
 * Usage:
 *   <script src="https://testdelegate.com/sdk/delegate.js"></script>
 *   <script>
 *     Delegate.init({ apiKey: 'your_key' });
 *     // When the user submits:
 *     const result = await Delegate.verify();
 *     // result.score, result.verdict, result.reasons
 *   </script>
 *
 * MIT License. See github.com/leocohen-byte/Delegate
 */

(function (root) {
  'use strict';

  var DEFAULT_API_URL = 'https://delegate-api-production-45ec.up.railway.app';

  var state = {
    initialized: false,
    config: null,
    startTime: null,
    firstInteractionAt: null,
    mouseMovements: 0,
    pasteEvents: 0,
    tabSwitches: 0,
    keyPresses: 0,
    fingerprint: null
  };

  // ---------- Device fingerprint ----------
  function generateFingerprint() {
    try {
      var canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 50;
      var ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = "14px 'Arial'";
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Delegate.fp.v1', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Delegate.fp.v1', 4, 17);
      var canvasData = canvas.toDataURL();

      var parts = [
        navigator.userAgent || '',
        navigator.language || '',
        (screen.width || 0) + 'x' + (screen.height || 0),
        screen.colorDepth || 0,
        new Date().getTimezoneOffset(),
        navigator.hardwareConcurrency || 'u',
        navigator.platform || '',
        navigator.deviceMemory || 'u',
        canvasData
      ];

      return 'fp_' + hash(parts.join('|'));
    } catch (e) {
      return 'fp_err_' + Math.random().toString(36).substring(2, 10);
    }
  }

  function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h |= 0;
    }
    return (h >>> 0).toString(16).padStart(8, '0');
  }

  // ---------- Behavioral tracking ----------
  function attachListeners() {
    var lastMouseMs = 0;
    document.addEventListener('mousemove', function () {
      var now = Date.now();
      if (now - lastMouseMs > 50) {
        state.mouseMovements++;
        if (!state.firstInteractionAt) state.firstInteractionAt = now;
        lastMouseMs = now;
      }
    }, { passive: true });

    document.addEventListener('paste', function () {
      state.pasteEvents++;
      if (!state.firstInteractionAt) state.firstInteractionAt = Date.now();
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) state.tabSwitches++;
    });

    document.addEventListener('keydown', function () {
      state.keyPresses++;
      if (!state.firstInteractionAt) state.firstInteractionAt = Date.now();
    }, { passive: true });
  }

  // ---------- Public API ----------
  function init(config) {
    if (state.initialized) {
      if (config && config.debug) console.warn('[Delegate] Already initialized');
      return;
    }
    state.config = {
      apiUrl: (config && config.apiUrl) || DEFAULT_API_URL,
      apiKey: (config && config.apiKey) || null,
      debug: (config && config.debug) === true
    };
    state.startTime = Date.now();
    state.fingerprint = generateFingerprint();
    state.initialized = true;
    attachListeners();

    if (state.config.debug) {
      console.log('[Delegate] Initialized. Fingerprint:', state.fingerprint);
    }
  }

  function getSignals() {
    var now = Date.now();
    var fillTime = state.firstInteractionAt
      ? now - state.firstInteractionAt
      : now - (state.startTime || now);

    return {
      fingerprint: state.fingerprint,
      webdriver: navigator.webdriver === true,
      formFillTimeMs: fillTime,
      mouseMovements: state.mouseMovements,
      pasteEvents: state.pasteEvents,
      tabSwitches: state.tabSwitches,
      keyPresses: state.keyPresses,
      screenWidth: screen.width,
      screenHeight: screen.height,
      timezone: (Intl && Intl.DateTimeFormat) ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'unknown',
      language: navigator.language || 'unknown',
      sdkVersion: '0.1.0'
    };
  }

  function verify(extraSignals) {
    if (!state.initialized) {
      return Promise.reject(new Error('[Delegate] Not initialized. Call Delegate.init() first.'));
    }

    var signals = getSignals();
    if (extraSignals) {
      for (var k in extraSignals) {
        if (Object.prototype.hasOwnProperty.call(extraSignals, k)) {
          signals[k] = extraSignals[k];
        }
      }
    }

    if (state.config.debug) {
      console.log('[Delegate] Verifying with signals:', signals);
    }

    var headers = { 'Content-Type': 'application/json' };
    if (state.config.apiKey) headers['X-API-Key'] = state.config.apiKey;

    return fetch(state.config.apiUrl + '/v1/verify', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(signals)
    }).then(function (res) {
      if (!res.ok) throw new Error('API returned ' + res.status);
      return res.json();
    }).then(function (result) {
      if (state.config.debug) console.log('[Delegate] Verdict:', result);
      result._signals = signals;
      return result;
    }).catch(function (err) {
      console.error('[Delegate] Verify failed:', err);
      return {
        score: 0,
        verdict: 'allow',
        reasons: ['Delegate API unreachable — defaulted to allow'],
        error: err.message,
        _signals: signals
      };
    });
  }

  function reset() {
    state.startTime = Date.now();
    state.firstInteractionAt = null;
    state.mouseMovements = 0;
    state.pasteEvents = 0;
    state.tabSwitches = 0;
    state.keyPresses = 0;
  }

  function currentSignals() {
    return state.initialized ? getSignals() : null;
  }

  root.Delegate = {
    init: init,
    verify: verify,
    reset: reset,
    currentSignals: currentSignals,
    version: '0.1.0'
  };

})(typeof window !== 'undefined' ? window : this);
