<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' https://api.openai.com https://api.anthropic.com https://generativelanguage.googleapis.com https://api.perplexity.ai https://dashscope.aliyuncs.com https://wishub-x6.ctyun.cn https://api.wandb.ai; script-src 'self' https://cdn.tailwindcss.com 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;">
  <title>⚔️ SpecEngine™ • BYOK • LLM • Pristine UI</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0a0a0a] text-white font-sans p-6 flex items-center justify-center min-h-screen">
  <div id="root" class="w-full max-w-4xl"></div>

  <script type="text/javascript">
    // ========== SPECENGINE™ v4.2 – SECURE SERVER-SIDE GATING ==========

    const GUMROAD_PAYMENT_URL = "https://gum.co/your_product_link"; 
    
    const ANTHROPIC_VERSION = '2023-06-01';
    const MAX_IDEA_LENGTH = 2000;
    const REQUEST_COOLDOWN_MS = 5000;

    // ---------- ⚛️ STATE MANAGEMENT ----------
    const state = {
      isInitializing: true,
      isVerified: false,
      validatingLicense: false,
      licenseError: '',
      
      idea: localStorage.getItem('specengine_idea') || '',
      apiKey: localStorage.getItem('specengine_apikey') || '',
      provider: localStorage.getItem('specengine_provider') || 'openai',
      model: localStorage.getItem('specengine_model') || 'gpt-4-turbo',
      
      output: null,
      loading: false,
      format: 'nlp',
      error: '',
      cooldown: false,
      lastRequestTime: 0,
      showApiKey: false
    };

    const modelOptions = {
      openai: [
        { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (Apr 2024)' },
        { value: 'gpt-4', label: 'GPT-4' },
        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
      ],
      anthropic: [
        { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
        { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' }
      ],
      google: [
        { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
        { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' }
      ],
      perplexity: [
        { value: 'sonar-pro', label: 'Sonar Pro (online)' },
        { value: 'sonar', label: 'Sonar (online)' }
      ],
      deepseekAlibaba: [
        { value: 'deepseek-v3', label: 'DeepSeek V3 (Alibaba)' },
        { value: 'deepseek-r1', label: 'DeepSeek R1' }
      ]
    };

    function setState(newState, triggerRender = true) {
      Object.assign(state, newState);
      if (newState.idea !== undefined) localStorage.setItem('specengine_idea', state.idea);
      if (newState.apiKey !== undefined) localStorage.setItem('specengine_apikey', state.apiKey);
      if (newState.provider !== undefined) localStorage.setItem('specengine_provider', state.provider);
      if (newState.model !== undefined) localStorage.setItem('specengine_model', state.model);
      
      if (triggerRender) render();
    }

    // ---------- 🛡️ SERVER-SIDE AUTHENTICATION ----------
    async function initApp() {
      const token = localStorage.getItem('specengine_token');
      if (token) {
        try {
          const res = await fetch('/api/check-session', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (res.ok) {
            const data = await res.json();
            if (data.token) localStorage.setItem('specengine_token', data.token);
            state.isVerified = true;
          } else {
            // Token invalid or entitlement revoked via webhook
            localStorage.removeItem('specengine_token');
            state.isVerified = false;
            state.licenseError = 'Session expired or subscription was revoked.';
          }
        } catch (e) {
          // Fail closed on network error to ensure maximum security
          state.isVerified = false;
          state.licenseError = 'Network error verifying session. Please check connection.';
        }
      }
      state.isInitializing = false;
      render();
    }

    async function verifyEnteredKey() {
      const input = document.getElementById('gumroad-key-input');
      const key = input.value.trim();
      if (!key) return;

      setState({ validatingLicense: true, licenseError: '' });
      
      try {
        const res = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ license_key: key })
        });
        
        const data = await res.json();
        
        if (res.ok && data.token) {
          localStorage.setItem('specengine_token', data.token);
          setState({ isVerified: true, validatingLicense: false, licenseError: '' });
        } else {
          setState({ validatingLicense: false, licenseError: data.error || 'Invalid or expired license key.' });
        }
      } catch (e) {
        setState({ validatingLicense: false, licenseError: 'Server connection error. Try again.' });
      }
    }

    // ---------- 🧠 VALIDATION & SCORING ----------
    function validateAndScore(spec, idea) {
      let score = 0;
      const breakdown = {};
      let clarity = 10;
      if (spec.requirements?.functional?.length >= 3) clarity = 18;
      if (spec.requirements?.functional?.length >= 4) clarity = 20;
      score += clarity; breakdown.clarity = clarity;

      let completeness = 0;
      if (spec.title) completeness += 5;
      if (spec.techStack?.raw) completeness += 5;
      if (spec.requirements?.functional?.length) completeness += 10;
      if (spec.dataModels && Object.keys(spec.dataModels).length) completeness += 5;
      if (spec.apiEndpoints?.length) completeness += 5;
      score += completeness; breakdown.completeness = completeness;

      let feasibility = 12;
      const stack = (spec.techStack?.raw || '').toLowerCase();
      const hasFrontend = /react|vue|angular|svelte|next|vite/i.test(stack);
      const hasBackend = /node|express|django|flask|rails/i.test(stack);
      if (hasFrontend && hasBackend) feasibility = 20;
      score += feasibility; breakdown.feasibility = Math.min(20, feasibility);

      let standards = (spec.security?.length >= 3) ? 15 : (spec.security?.length > 0 ? 8 : 0);
      score += standards; breakdown.standards = standards;

      let consistency = spec.architecture ? 15 : 8;
      score += consistency; breakdown.consistency = consistency;

      let penalty = 0;
      const firstReq = spec.requirements?.functional?.[0] || '';
      if (firstReq.includes('User can an app')) penalty += 10;
      if (!spec.title || spec.title.length < 3) penalty += 5;

      breakdown.penalty = penalty;
      score = Math.max(0, Math.min(100, score - penalty));

      const essentialSections = [
        { name: 'Title', valid: !!spec.title },
        { name: 'Tech Stack', valid: !!(spec.techStack?.raw) },
        { name: 'Functional Requirements', valid: !!(spec.requirements?.functional?.length) }
      ];
      const missingEssential = essentialSections.filter(s => !s.valid).map(s => s.name);
      
      if (missingEssential.length > 0) {
        score = Math.min(score, 50);
        breakdown.summary = `⚠️ Missing: ${missingEssential.join(', ')}`;
      } else {
        breakdown.summary = score >= 80 ? '✅ Production ready' : '📋 Needs minor refinements';
      }
      return { score, breakdown, missingEssential };
    }

    const EXTRACT_PATTERN_PREFIXES = ['##', '#', '\\*\\*', '\\d+\\.'];
    function extractSection(content, headingName) {
      for (let prefix of EXTRACT_PATTERN_PREFIXES) {
        const match = content.match(new RegExp(`${prefix}\\s*${headingName}\\s*\\n([^#]+)`, 'i'));
        if (match) return match[1].trim();
      }
      return '';
    }

    function parseSpecFromMarkdown(text) {
      const spec = { title: '', techStack: { raw: '' }, requirements: { functional: [] }, dataModels: {}, apiEndpoints: [], architecture: '', security: [] };
      if (!text) return { spec, isValid: false };

      const titleMatch = text.match(/#\s+(.+)$/m);
      if (titleMatch) spec.title = titleMatch[1].trim();

      const techMatch = text.match(/\*\*Tech Stack:\*\*\s*(.+)/i);
      if (techMatch) spec.techStack.raw = techMatch[1].trim();

      const funcSection = extractSection(text, 'Functional Requirements');
      if (funcSection) {
        funcSection.split('\n').forEach(line => {
          line = line.trim();
          if (!line) return;
          if (line.match(/^[-*]/)) spec.requirements.functional.push(line.replace(/^[-*]\s*/, ''));
          else if (line.match(/^\d+\./)) spec.requirements.functional.push(line);
        });
      }
      return { spec, isValid: !!(spec.title && spec.requirements.functional.length) };
    }

    function getEndpointAndHeaders(provider, model, apiKey) {
      switch (provider) {
        case 'openai': return { endpoint: 'https://api.openai.com/v1/chat/completions', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: { model } };
        case 'anthropic': return { endpoint: 'https://api.anthropic.com/v1/messages', headers: { 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION, 'Content-Type': 'application/json' }, body: { model, max_tokens: 4000 } };
        case 'google': return { endpoint: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, headers: { 'Content-Type': 'application/json' }, body: {} };
        case 'perplexity': return { endpoint: 'https://api.perplexity.ai/chat/completions', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: { model } };
        case 'deepseekAlibaba': return { endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: { model } };
        default: throw new Error('Provider not supported');
      }
    }

    function sanitizeIdea(idea) {
      if (!idea) return '';
      return idea.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').slice(0, MAX_IDEA_LENGTH).trim();
    }

    function canMakeRequest() { return Date.now() - state.lastRequestTime >= REQUEST_COOLDOWN_MS; }

    async function generateSpec() {
      // 🚨 HARD STOP: Enforce entitlement before processing
      if (!state.isVerified) {
        return setState({ error: 'System Access Denied. Active license required.' });
      }

      const currentIdea = document.getElementById('idea-input').value;
      const currentApi = document.getElementById('apikey-input').value;
      setState({ idea: currentIdea, apiKey: currentApi }, false);

      if (!state.idea.trim() || !state.apiKey) return setState({ error: 'Enter an idea and your API key' });
      if (!canMakeRequest()) return setState({ error: `Cooldown active. Please wait.` });

      setState({ loading: true, cooldown: true, error: '', output: null });
      const safeIdea = sanitizeIdea(state.idea);

      try {
        const systemPrompt = `You are an expert software architect. Generate a complete, production‑ready specification for the user's app idea. Format: Markdown. Sections: # Title, **Tech Stack:**, ## Functional Requirements, ## Data Models, ## API Endpoints, ## Architecture, ## Security & Compliance. No code snippets.`;
        const { endpoint, headers, body: providerBody } = getEndpointAndHeaders(state.provider, state.model, state.apiKey);
        
        let body;
        if (state.provider === 'google') body = { contents: [{ parts: [{ text: systemPrompt + '\n\nIdea: ' + safeIdea }] }] };
        else if (state.provider === 'anthropic') body = { ...providerBody, system: systemPrompt, messages: [{ role: 'user', content: safeIdea }] };
        else body = { ...providerBody, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: safeIdea }], temperature: 0.7 };

        const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });

        if (!res.ok) throw new Error(res.status === 401 ? 'Invalid LLM API key or unauthorized.' : `Request failed (${res.status}).`);

        const data = await res.json();
        let specText = data.choices?.[0]?.message?.content || data.content?.[0]?.text || data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!specText) throw new Error('Unable to parse model response.');

        const { spec, isValid } = parseSpecFromMarkdown(specText);
        const { score, breakdown, missingEssential } = validateAndScore(spec, safeIdea);

        setState({ 
          output: { 
            spec: state.format === 'json' ? JSON.stringify({ ...spec, score, validation: breakdown }, null, 2) : specText, 
            score, breakdown, missingEssential, isValid 
          }, 
          loading: false, cooldown: false, lastRequestTime: Date.now() 
        });
      } catch (err) {
        setState({ error: err.message, loading: false, cooldown: false });
      }
    }

    function escapeHtml(unsafe) {
      return (unsafe||'').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    function render() {
      const rootEl = document.getElementById('root');
      
      if (state.isInitializing) {
        rootEl.innerHTML = `<div class="text-cyan-400 text-center animate-pulse mt-20 text-xl font-bold">Verifying Session...</div>`;
        return;
      }

      // --- GUMROAD PAYWALL UI ---
      if (!state.isVerified) {
        rootEl.innerHTML = `
          <div class="bg-black/90 border border-white/10 rounded-2xl p-8 max-w-md mx-auto mt-20 shadow-2xl">
            <h2 class="text-3xl font-extrabold text-white mb-2 text-center">SpecEngine™</h2>
            <p class="text-gray-400 mb-8 text-center text-sm">Enter your Gumroad license key to access the app.</p>
            <div class="flex flex-col gap-4">
              <input id="gumroad-key-input" type="text" placeholder="XXXXXXXX-XXXXXXXX-XXXXXXXX" class="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400 outline-none text-white font-mono text-sm" />
              <button id="verify-license-btn" class="w-full py-3 rounded-lg font-bold bg-cyan-600 hover:bg-cyan-500 transition text-white disabled:opacity-50">
                ${state.validatingLicense ? 'Authenticating...' : 'Secure Login'}
              </button>
              ${state.licenseError ? `<p class="text-red-400 text-sm text-center">${state.licenseError}</p>` : ''}
              <a href="${GUMROAD_PAYMENT_URL}" target="_blank" class="text-xs text-center text-cyan-500 hover:underline mt-2">Get a license ($5/mo)</a>
            </div>
            <p class="text-[10px] text-gray-600 mt-8 text-center border-t border-white/5 pt-4">
              Secured via Server-Side Entitlement Check
            </p>
          </div>
        `;
        document.getElementById('verify-license-btn').addEventListener('click', verifyEnteredKey);
        return;
      }

      // --- MAIN UI ---
      const html = `
        <div class="space-y-6">
          <div class="flex justify-center items-center gap-3 mb-8">
            <h1 class="text-5xl font-extrabold text-center tracking-tight">
              <span class="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">⚔️ SpecEngine™</span>
            </h1>
            <button id="logout-btn" class="text-xs bg-red-900/40 text-red-400 hover:text-red-300 px-3 py-1 rounded-full border border-red-900/50 transition">Log Out</button>
          </div>

          <div class="space-y-4">
            <input type="text" id="idea-input" placeholder="e.g. A Chrome extension that summarizes YouTube comments" value="${escapeHtml(state.idea)}" maxlength="${MAX_IDEA_LENGTH}" class="w-full h-14 px-6 text-lg rounded-full bg-white/5 border-2 border-white/10 focus:border-cyan-400 outline-none text-white placeholder-gray-500 transition-all" />

            <div class="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-white/5 rounded-2xl p-4">
              <div class="flex-1">
                <label class="block text-xs text-gray-400 mb-1">🔑 API Key (Local)</label>
                <div class="relative">
                  <input type="${state.showApiKey ? 'text' : 'password'}" id="apikey-input" placeholder="sk-..." value="${escapeHtml(state.apiKey)}" class="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-400 outline-none pr-10" />
                  <button id="toggle-apikey" class="absolute inset-y-0 right-0 px-3 text-gray-400">👁️</button>
                </div>
              </div>
              <div class="flex-1">
                <label class="block text-xs text-gray-400 mb-1">🧠 Provider</label>
                <select id="provider-select" class="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-400 outline-none">
                  ${Object.keys(modelOptions).map(p => `<option value="${p}" ${state.provider === p ? 'selected' : ''}>${p.toUpperCase()}</option>`).join('')}
                </select>
              </div>
              <div class="flex-1">
                <label class="block text-xs text-gray-400 mb-1">🤖 Model</label>
                <select id="model-select" class="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-400 outline-none">
                  ${(modelOptions[state.provider] || []).map(opt => `<option value="${opt.value}" ${state.model === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="flex items-center justify-between gap-4">
              <div class="flex rounded-full bg-white/5 p-1">
                <button id="format-nlp" class="px-6 py-2 rounded-full text-sm font-medium transition ${state.format === 'nlp' ? 'bg-cyan-500 text-white' : 'text-gray-400'}">📝 NLP</button>
                <button id="format-json" class="px-6 py-2 rounded-full text-sm font-medium transition ${state.format === 'json' ? 'bg-cyan-500 text-white' : 'text-gray-400'}">📦 JSON</button>
              </div>
              <button id="generate-btn" ${state.loading || state.cooldown ? 'disabled' : ''} class="px-10 py-3 rounded-full text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 disabled:opacity-50 transition shadow-lg">
                ${state.loading ? 'FORGING...' : '🔥 GENERATE'}
              </button>
            </div>
          </div>

          ${state.error ? `<div class="bg-red-900/50 border border-red-500 rounded-xl p-4 text-red-200 text-sm font-mono whitespace-pre-wrap">${escapeHtml(state.error)}</div>` : ''}

          ${state.output ? `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div class="md:col-span-2 bg-black/90 border border-white/10 rounded-2xl p-6 overflow-auto max-h-[600px]">
                <pre class="text-sm whitespace-pre-wrap font-mono text-gray-200">${escapeHtml(state.output.spec)}</pre>
              </div>
              ${state.format === 'nlp' ? `
                <div class="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-6">
                  <h3 class="text-xl font-bold text-cyan-400 mb-4">VALIDATION</h3>
                  <div class="text-5xl font-extrabold text-white text-center mb-4">${state.output.score}</div>
                  <p class="text-center text-white/70 text-sm mb-4">${escapeHtml(state.output.breakdown.summary)}</p>
                  <div class="text-xs text-gray-400 space-y-1">
                    <div class="flex justify-between"><span>Clarity:</span><span>${state.output.breakdown.clarity}/20</span></div>
                    <div class="flex justify-between"><span>Completeness:</span><span>${state.output.breakdown.completeness}/30</span></div>
                    <div class="flex justify-between"><span>Feasibility:</span><span>${state.output.breakdown.feasibility}/20</span></div>
                  </div>
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>
      `;

      rootEl.innerHTML = html;
      attachEventListeners();
    }

    function attachEventListeners() {
      const ideaInput = document.getElementById('idea-input');
      if (ideaInput) ideaInput.addEventListener('input', (e) => setState({ idea: e.target.value }, false));

      const apiKeyInput = document.getElementById('apikey-input');
      if (apiKeyInput) apiKeyInput.addEventListener('input', (e) => setState({ apiKey: e.target.value }, false));

      document.getElementById('toggle-apikey')?.addEventListener('click', () => setState({ showApiKey: !state.showApiKey }));
      
      document.getElementById('provider-select')?.addEventListener('change', (e) => {
        const newProvider = e.target.value;
        setState({ provider: newProvider, model: modelOptions[newProvider]?.[0]?.value || '' });
      });
      
      document.getElementById('model-select')?.addEventListener('change', (e) => setState({ model: e.target.value }));
      document.getElementById('format-nlp')?.addEventListener('click', () => setState({ format: 'nlp' }));
      document.getElementById('format-json')?.addEventListener('click', () => setState({ format: 'json' }));
      document.getElementById('generate-btn')?.addEventListener('click', generateSpec);
      
      document.getElementById('logout-btn')?.addEventListener('click', () => {
        localStorage.removeItem('specengine_token');
        setState({ isVerified: false, licenseError: 'Logged out successfully.' });
      });
    }

    // Start App
    initApp();
  </script>
</body>
</html>
