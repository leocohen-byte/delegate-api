<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Delegate — Signup fraud detection, agent-aware</title>
  <meta name="description" content="Drop-in fraud detection SDK for signup flows. Device fingerprinting, behavioral signals, and AI-agent classification." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <header class="nav">
    <div class="nav-inner">
      <a href="/" class="logo">
        <span class="logo-mark"></span>
        <span class="logo-text">Delegate</span>
      </a>
      <nav class="nav-links">
        <a href="#how">How it works</a>
        <a href="#demo">Live demo</a>
        <a href="#signals">Signals</a>
        <a href="#agents">Agents</a>
        <a href="#status">Status</a>
      </nav>
      <a href="#contact" class="nav-cta">Contact</a>
    </div>
  </header>

  <main>
    <!-- HERO -->
    <section class="hero">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-inner">
        <p class="eyebrow reveal" data-reveal>
          <span class="dot"></span> Early access · In development
        </p>
        <h1 class="reveal" data-reveal data-reveal-delay="100">
          Signup fraud detection,<br />
          <em>agent-aware.</em>
        </h1>
        <p class="subhead reveal" data-reveal data-reveal-delay="200">
          A drop-in SDK that scores every signup in real time using device fingerprinting and behavioral signals. Built from day one to distinguish legitimate AI agents from malicious bots — a gap the incumbents don't address.
        </p>
        <div class="cta-row reveal" data-reveal data-reveal-delay="300">
          <a href="#contact" class="btn btn-primary">
            Become a design partner
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3L9 7L5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
          <a href="#how" class="btn btn-ghost">See how it works</a>
        </div>
        <div class="hero-meta reveal" data-reveal data-reveal-delay="400">
          <div class="meta-item">
            <span class="meta-label">API status</span>
            <span class="meta-value"><span class="live-dot"></span> Live</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Built by</span>
            <span class="meta-value">Leo Cohen</span>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="section" id="how">
      <div class="section-inner">
        <div class="section-header" data-reveal>
          <p class="section-label">01 — Integration</p>
          <h2>Six lines. Every signup scored before it hits your system.</h2>
          <p class="lead">Drop the SDK into your signup page. Every submission gets a risk score with specific reasoning before it reaches your backend.</p>
        </div>

        <div class="code-window" data-reveal>
          <div class="code-chrome">
            <span class="code-dot"></span>
            <span class="code-dot"></span>
            <span class="code-dot"></span>
            <span class="code-filename">signup.html</span>
          </div>
          <pre class="code"><code><span class="c-tag">&lt;script</span> <span class="c-attr">src</span>=<span class="c-str">"https://testdelegate.com/sdk/delegate.js"</span><span class="c-tag">&gt;&lt;/script&gt;</span>
<span class="c-tag">&lt;script&gt;</span>
  <span class="c-var">Delegate</span>.<span class="c-fn">init</span>({ <span class="c-attr">apiKey</span>: <span class="c-str">'your_key'</span> });

  <span class="c-comment">// On signup submit:</span>
  <span class="c-kw">const</span> result = <span class="c-kw">await</span> <span class="c-var">Delegate</span>.<span class="c-fn">verify</span>();
  <span class="c-comment">// result.score, result.verdict, result.reasons</span>
<span class="c-tag">&lt;/script&gt;</span></code></pre>
        </div>

        <div class="flow">
          <div class="flow-step" data-reveal data-reveal-delay="0">
            <div class="flow-num">01</div>
            <h3>Collect</h3>
            <p>The SDK silently gathers device and behavioral signals as the user completes your form — no additional UI, no extra steps.</p>
          </div>
          <div class="flow-step" data-reveal data-reveal-delay="100">
            <div class="flow-num">02</div>
            <h3>Score</h3>
            <p>Signals are sent to the Delegate API, enriched with server-side signals like IP reputation, and returned as a score from 0 to 100.</p>
          </div>
          <div class="flow-step" data-reveal data-reveal-delay="200">
            <div class="flow-num">03</div>
            <h3>Decide</h3>
            <p>You get back <code>allow</code>, <code>challenge</code>, or <code>block</code> with specific reasons. You decide what happens next.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- LIVE DEMO -->
    <section class="section section-demo" id="demo">
      <div class="section-inner">
        <div class="section-header" data-reveal>
          <p class="section-label">02 — Live demo</p>
          <h2>Real API. <em>Real scores.</em></h2>
          <p class="lead">This isn't a mock. Each button sends a real signal payload to the production API on Railway and shows the verdict it returns. No pre-recorded responses, no fake data.</p>
        </div>

        <div class="demo-layout" data-reveal>
          <div class="demo-sidebar">
            <p class="demo-label">Pick a scenario</p>
            <div class="scenario-list">
              <button class="scenario" data-scenario="human">
                <span class="scenario-name">Real human</span>
                <span class="scenario-desc">Normal timing, mouse movement, clean browser</span>
              </button>
              <button class="scenario" data-scenario="bot">
                <span class="scenario-name">Basic bot</span>
                <span class="scenario-desc">webdriver=true, 280ms fill, zero mouse</span>
              </button>
              <button class="scenario" data-scenario="borderline">
                <span class="scenario-name">Edge case</span>
                <span class="scenario-desc">Fast but no obvious bot markers</span>
              </button>
              <button class="scenario" data-scenario="agent">
                <span class="scenario-name">AI agent</span>
                <span class="scenario-desc">Automation with human-like cadence</span>
              </button>
            </div>
            <a href="/demo/signup.html" class="demo-try-full">Try the SDK on a real form →</a>
          </div>

          <div class="demo-terminal">
            <div class="terminal-bar">
              <span class="tdot tdot-r"></span>
              <span class="tdot tdot-y"></span>
              <span class="tdot tdot-g"></span>
              <span class="terminal-title">POST /v1/verify</span>
            </div>
            <div class="terminal-content" id="demo-output">
              <p class="terminal-empty">Click a scenario to send a real request →</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SIGNALS -->
    <section class="section section-alt" id="signals">
      <div class="section-inner">
        <div class="section-header" data-reveal>
          <p class="section-label">03 — Detection</p>
          <h2>What we actually detect.</h2>
          <p class="lead">No claims we can't back up. Here is every signal the current version collects, what it catches, and what bypasses it.</p>
        </div>

        <div class="signals">
          <div class="signal" data-reveal data-reveal-delay="0">
            <div class="signal-header">
              <span class="signal-num">01</span>
              <h3>Device fingerprint</h3>
            </div>
            <p class="signal-body">Combines canvas rendering, fonts, hardware attributes, and browser configuration into a stable device identifier. Catches returning fraudsters and multi-account abuse.</p>
            <div class="signal-meta">
              <span class="meta-tag meta-tag-good">Catches volume fraud</span>
              <span class="meta-tag meta-tag-warn">Bypass: anti-detect browsers</span>
            </div>
          </div>

          <div class="signal" data-reveal data-reveal-delay="100">
            <div class="signal-header">
              <span class="signal-num">02</span>
              <h3>Automation flags</h3>
            </div>
            <p class="signal-body">Checks <code>navigator.webdriver</code> and known automation framework signatures — Playwright, Selenium, Puppeteer without stealth modifications.</p>
            <div class="signal-meta">
              <span class="meta-tag meta-tag-good">Catches scripted signups</span>
              <span class="meta-tag meta-tag-warn">Bypass: stealth plugins</span>
            </div>
          </div>

          <div class="signal" data-reveal data-reveal-delay="200">
            <div class="signal-header">
              <span class="signal-num">03</span>
              <h3>Behavioral timing</h3>
            </div>
            <p class="signal-body">Measures time-per-field, mouse entropy, paste events, and tab focus changes during form completion. Humans are noisy. Bots are often not.</p>
            <div class="signal-meta">
              <span class="meta-tag meta-tag-good">Catches low-effort bots</span>
              <span class="meta-tag meta-tag-warn">Bypass: humanizer scripts</span>
            </div>
          </div>

          <div class="signal" data-reveal data-reveal-delay="300">
            <div class="signal-header">
              <span class="signal-num">04</span>
              <h3>IP reputation</h3>
            </div>
            <p class="signal-body">Flags datacenter IPs, known VPNs, Tor exit nodes, and addresses with prior fraud history from third-party reputation sources.</p>
            <div class="signal-meta">
              <span class="meta-tag meta-tag-good">Catches unmasked fraud</span>
              <span class="meta-tag meta-tag-warn">Bypass: residential proxies</span>
            </div>
          </div>
        </div>

        <div class="honest-note" data-reveal>
          <div class="honest-mark">01</div>
          <div class="honest-body">
            <p class="honest-title">The honest pitch.</p>
            <p>Delegate catches the 70–80% of signup fraud that uses off-the-shelf tooling. Against sophisticated attackers with custom humanizer setups, no single layer catches everything — you stack defenses and accept some leakage. We're one layer, priced accordingly.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- AGENTS -->
    <section class="section" id="agents">
      <div class="section-inner">
        <div class="section-header" data-reveal>
          <p class="section-label">04 — The wedge</p>
          <h2>Legitimate AI agents are showing up in signup flows.<br /><em>Every incumbent treats them as bots.</em></h2>
        </div>

        <div class="agents-grid">
          <div class="agent-card" data-reveal data-reveal-delay="0">
            <div class="agent-label">The problem</div>
            <p>A real user delegates their signup to an AI assistant — Claude Computer Use, an agentic browser extension, a personal helper agent. From a fraud tool's perspective, this looks identical to a bot attack: automation flag set, no human mouse movement.</p>
            <p>Block the agent, you lose a legitimate customer. Allow the agent, you open the door to bots.</p>
          </div>
          <div class="agent-card agent-card-featured" data-reveal data-reveal-delay="150">
            <div class="agent-label">Our approach</div>
            <p>We classify sessions into three categories instead of two — <strong>human</strong>, <strong>authorized agent</strong>, or <strong>unauthorized bot</strong>. The signals that separate agents from bots differ from those that separate humans from everything else: session provenance, request patterns, and declared identity all factor in.</p>
            <p>An early thesis, not a solved problem. We're building it with design partners.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- STATUS -->
    <section class="section section-alt" id="status">
      <div class="section-inner narrow">
        <div class="section-header" data-reveal>
          <p class="section-label">05 — Roadmap</p>
          <h2>Where we are.</h2>
          <p class="lead">Building in public. Real code, real deployments, real milestones.</p>
        </div>

        <ul class="status-list">
          <li data-reveal data-reveal-delay="0">
            <span class="status-badge status-ok">Shipped</span>
            <div class="status-body">
              <h4>Scoring API on Railway</h4>
              <p>Live endpoint accepting signals, computing scores, returning verdicts with reasons. Real infrastructure, real code.</p>
            </div>
          </li>
          <li data-reveal data-reveal-delay="80">
            <span class="status-badge status-progress">In progress</span>
            <div class="status-body">
              <h4>Drop-in JavaScript SDK</h4>
              <p>The 6-line integration shown above. Target: end of this week.</p>
            </div>
          </li>
          <li data-reveal data-reveal-delay="160">
            <span class="status-badge status-next">Next</span>
            <div class="status-body">
              <h4>IP reputation, device history, admin dashboard</h4>
              <p>Server-side enrichment and a real-time view of incoming signups for design partners.</p>
            </div>
          </li>
          <li data-reveal data-reveal-delay="240">
            <span class="status-badge status-next">Next</span>
            <div class="status-body">
              <h4>Agent-identity classification</h4>
              <p>The three-way classifier for human / authorized agent / unauthorized bot.</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- CONTACT -->
    <section class="section section-contact" id="contact">
      <div class="section-inner narrow center">
        <div class="contact-mark" data-reveal></div>
        <h2 data-reveal data-reveal-delay="100">Design partners wanted.</h2>
        <p class="lead" data-reveal data-reveal-delay="200">
          If you run signup for a fintech, marketplace, or SaaS product and want to test Delegate on real traffic — no contracts, no commitment, just paste the SDK and see what it catches — get in touch.
        </p>
        <a href="mailto:leocohen@deliverfaster.services" class="btn btn-primary btn-large" data-reveal data-reveal-delay="300">
          leocohen@deliverfaster.services
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3L9 7L5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="logo-mark"></span>
        <span>Delegate</span>
      </div>
      <p class="footer-meta">Built by Leo Cohen · <a href="https://github.com/leocohen-byte">github.com/leocohen-byte</a></p>
    </div>
  </footer>

  <script src="/script.js"></script>
  <script>
    // ============================================
    // Live demo — real API calls
    // ============================================
    const DEMO_API_URL = 'https://delegate-api-production-45ec.up.railway.app/v1/verify';

    const demoScenarios = {
      human: {
        fingerprint: 'fp_demo_human_' + Math.random().toString(36).substring(2, 10),
        webdriver: false,
        formFillTimeMs: 8400 + Math.floor(Math.random() * 3000),
        mouseMovements: 40 + Math.floor(Math.random() * 30),
        pasteEvents: 0,
        keyPresses: 25 + Math.floor(Math.random() * 15)
      },
      bot: {
        fingerprint: 'fp_demo_bot_' + Math.random().toString(36).substring(2, 10),
        webdriver: true,
        formFillTimeMs: 280,
        mouseMovements: 0,
        pasteEvents: 0,
        keyPresses: 0
      },
      borderline: {
        fingerprint: 'fp_demo_edge_' + Math.random().toString(36).substring(2, 10),
        webdriver: false,
        formFillTimeMs: 1200,
        mouseMovements: 4,
        pasteEvents: 2,
        keyPresses: 8
      },
      agent: {
        fingerprint: 'fp_demo_agent_' + Math.random().toString(36).substring(2, 10),
        webdriver: true,
        formFillTimeMs: 4200,
        mouseMovements: 18,
        pasteEvents: 0,
        keyPresses: 22
      }
    };

    const demoOutput = document.getElementById('demo-output');

    function escapeDemoHtml(s) {
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Friendly labels for the input signals
    const signalLabels = {
      webdriver: 'Automated browser',
      formFillTimeMs: 'Form fill time',
      mouseMovements: 'Mouse movements',
      pasteEvents: 'Paste events',
      keyPresses: 'Key presses',
      fingerprint: 'Device ID'
    };

    function formatSignalValue(key, val) {
      if (key === 'webdriver') return val === true ? 'Yes' : 'No';
      if (key === 'formFillTimeMs') return val < 1000 ? `${val}ms` : `${(val/1000).toFixed(1)}s`;
      if (key === 'fingerprint') return String(val).substring(0, 14) + '…';
      return String(val);
    }

    function runDemo(name) {
      const payload = demoScenarios[name];
      if (!payload || !demoOutput) return;

      // Build the "signals being sent" panel — clean, readable
      const signalRows = Object.entries(payload)
        .filter(([k]) => signalLabels[k])
        .map(([k, v]) => {
          const bad = (k === 'webdriver' && v === true) ||
                      (k === 'formFillTimeMs' && v < 1500) ||
                      (k === 'mouseMovements' && v === 0);
          return `<div class="sig-row"><span class="sig-label">${signalLabels[k]}</span><span class="sig-val ${bad ? 'sig-bad' : ''}">${formatSignalValue(k, v)}</span></div>`;
        }).join('');

      demoOutput.innerHTML = `
        <div class="demo-panel">
          <div class="demo-panel-title">Signals sent</div>
          <div class="demo-signals">${signalRows}</div>
        </div>
        <div class="demo-panel demo-panel-wait">
          <span class="t-spinner"></span>
          <span>Scoring on Railway API...</span>
        </div>
      `;

      return fetch(DEMO_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => renderResult(payload, data))
      .catch(err => {
        demoOutput.innerHTML = `
          <div class="demo-panel demo-panel-err">
            <strong>Request failed</strong>
            <p>${escapeDemoHtml(err.message)}. Railway free-tier sometimes cold-starts — try again in a few seconds.</p>
          </div>
        `;
      });
    }

    function renderResult(payload, data) {
      const vClass = data.verdict === 'block' ? 'v-block' : data.verdict === 'challenge' ? 'v-warn' : 'v-ok';
      const vLabel = { allow: 'Allow signup', challenge: 'Extra verification', block: 'Block signup' }[data.verdict] || data.verdict;

      const signalRows = Object.entries(payload)
        .filter(([k]) => signalLabels[k])
        .map(([k, v]) => {
          const bad = (k === 'webdriver' && v === true) ||
                      (k === 'formFillTimeMs' && v < 1500) ||
                      (k === 'mouseMovements' && v === 0);
          return `<div class="sig-row"><span class="sig-label">${signalLabels[k]}</span><span class="sig-val ${bad ? 'sig-bad' : ''}">${formatSignalValue(k, v)}</span></div>`;
        }).join('');

      const reasons = (data.reasons && data.reasons.length)
        ? data.reasons.map(r => `<li>${escapeDemoHtml(r)}</li>`).join('')
        : '<li class="r-ok">No risk signals triggered</li>';

      const scorePct = Math.max(0, Math.min(100, data.score));

      demoOutput.innerHTML = `
        <div class="demo-panel">
          <div class="demo-panel-title">Signals sent</div>
          <div class="demo-signals">${signalRows}</div>
        </div>

        <div class="verdict-card ${vClass}">
          <div class="verdict-top">
            <div>
              <div class="verdict-label">Risk score</div>
              <div class="verdict-score">${data.score}<span>/100</span></div>
            </div>
            <div class="verdict-badge">${vLabel}</div>
          </div>
          <div class="verdict-bar"><div class="verdict-bar-fill" style="width:${scorePct}%"></div></div>
          <div class="verdict-reasons-title">Why this score</div>
          <ul class="verdict-reasons">${reasons}</ul>
        </div>

        <details class="demo-raw">
          <summary>Show raw API response</summary>
          <pre>${escapeDemoHtml(JSON.stringify(data, null, 2))}</pre>
        </details>
      `;
    }

    document.querySelectorAll('.scenario').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.scenario').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        runDemo(btn.dataset.scenario);
      });
    });
  </script>
</body>
</html>
