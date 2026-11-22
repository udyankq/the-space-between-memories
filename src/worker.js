// The Space Between Memories — AI proxy.
// The API key lives ONLY in Cloudflare secrets (GEMINI_API_KEY or ANTHROPIC_API_KEY), never in the game file.
// POST /api/design  {prompt: string, images: [base64 jpeg/png], lang?: 'ru'|'en'}  →  {ok:true, json:{…}}  |  {ok:false, error}
// GET  /api/health  →  {ok:true, provider, model}
const DEFAULT_MODEL = { gemini: 'gemini-flash-latest', anthropic: 'claude-haiku-5-5', openrouter: 'google/gemma-4-26b-a4b-it:free' };
const MAX_IMAGES = 6, MAX_IMAGE_B64 = 1_600_000, MAX_PROMPT = 24_000, MAX_BODY = 10_500_000;
const hits = new Map(); // best-effort per-isolate rate limit

function cors(req, env) {
  const o = req.headers.get('Origin') || '';
  const self = new URL(req.url).origin;
  const ok = !o || o === self || (env.ALLOW_FILE === '1' && o === 'null') || (env.EXTRA_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean).includes(o);
  return { ok, headers: { 'Access-Control-Allow-Origin': ok ? (o || self) : self, 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400', 'Vary': 'Origin' } };
}
const json = (obj, status, headers) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers } });
function limited(ip, max) {
  const now = Date.now(), win = 10 * 60 * 1000, a = (hits.get(ip) || []).filter(t => now - t < win);
  if (a.length >= max) { hits.set(ip, a); return true; }
  a.push(now); hits.set(ip, a); if (hits.size > 5000) hits.clear(); return false;
}
function parseModelJson(text) {
  if (typeof text !== 'string') throw new Error('empty model answer');
  let t = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a < 0 || b < a) throw new Error('model answer is not JSON');
  const obj = JSON.parse(t.slice(a, b + 1));
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) throw new Error('model answer is not an object');
  return obj;
}
async function callGemini(env, model, prompt, images) {
  const parts = [{ text: prompt }, ...images.map(d => ({ inline_data: { mime_type: d.mime, data: d.b64 } }))];
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
    body: JSON.stringify({ contents: [{ role: 'user', parts }], generationConfig: { responseMimeType: 'application/json', temperature: 0.6, maxOutputTokens: 4096 } }),
  });
  const j = await r.json().catch(() => null);
  if (!r.ok) throw Object.assign(new Error((j && j.error && j.error.message) || ('Gemini HTTP ' + r.status)), { status: r.status });
  const text = j && j.candidates && j.candidates[0] && j.candidates[0].content && (j.candidates[0].content.parts || []).map(p => p.text || '').join('');
  if (!text) throw new Error('Gemini returned no text' + (j && j.promptFeedback && j.promptFeedback.blockReason ? ' (blocked: ' + j.promptFeedback.blockReason + ')' : ''));
  return text;
}
async function callAnthropic(env, model, prompt, images) {
  const content = [...images.map(d => ({ type: 'image', source: { type: 'base64', media_type: d.mime, data: d.b64 } })), { type: 'text', text: prompt }];
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model, max_tokens: 4096, temperature: 0.6, messages: [{ role: 'user', content }] }),
  });
  const j = await r.json().catch(() => null);
  if (!r.ok) throw Object.assign(new Error((j && j.error && j.error.message) || ('Anthropic HTTP ' + r.status)), { status: r.status });
  return (j && Array.isArray(j.content) ? j.content : []).filter(c => c.type === 'text').map(c => c.text).join('');
}
async function callOpenRouter(env, model, prompt, images) {
  const content = [{ type: 'text', text: prompt }, ...images.map(d => ({ type: 'image_url', image_url: { url: `data:${d.mime};base64,${d.b64}` } }))];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  let r;
  try {
    r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST', signal: controller.signal,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.OPENROUTER_API_KEY}` },
      body: JSON.stringify({ model, messages: [{ role: 'user', content }], temperature: 0.5, max_tokens: 4096 }),
    });
  } finally { clearTimeout(timeout); }
  const j = await r.json().catch(() => null);
  if (!r.ok) throw Object.assign(new Error((j && j.error && j.error.message) || ('OpenRouter HTTP ' + r.status)), { status: r.status });
  const message = j && j.choices && j.choices[0] && j.choices[0].message;
  const answer = message && message.content;
  if (typeof answer === 'string') return answer;
  if (Array.isArray(answer)) return answer.filter(x => x.type === 'text').map(x => x.text || '').join('');
  throw new Error('OpenRouter returned no text');
}
export default {
  async fetch(req, env) {
    const url = new URL(req.url), c = cors(req, env);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS ? env.ASSETS.fetch(req) : new Response('Not found', { status: 404 });
    if (req.method === 'OPTIONS') return new Response(null, { status: c.ok ? 204 : 403, headers: c.headers });
    if (!c.ok) return json({ ok: false, error: 'origin not allowed' }, 403, c.headers);
    const provider = ['anthropic', 'gemini', 'openrouter'].includes(env.PROVIDER) ? env.PROVIDER : 'openrouter';
    const key = provider === 'anthropic' ? env.ANTHROPIC_API_KEY : provider === 'gemini' ? env.GEMINI_API_KEY : env.OPENROUTER_API_KEY;
    const model = (env.MODEL || '').trim() || DEFAULT_MODEL[provider];
    if (url.pathname === '/api/health') return json({ ok: !!key, provider, model, error: key ? undefined : 'API key secret is not set' }, 200, c.headers);
    if (url.pathname !== '/api/design' || req.method !== 'POST') return json({ ok: false, error: 'not found' }, 404, c.headers);
    if (!key) return json({ ok: false, error: 'API key secret is not set on the server' }, 503, c.headers);
    const ip = req.headers.get('CF-Connecting-IP') || 'unknown';
    if (limited(ip, Math.max(1, parseInt(env.RATE_LIMIT || '12', 10) || 12))) return json({ ok: false, error: 'rate limited, try again in a few minutes' }, 429, c.headers);
    const len = +req.headers.get('Content-Length') || 0;
    if (len > MAX_BODY) return json({ ok: false, error: 'request too large' }, 413, c.headers);
    let body; try { body = await req.json(); } catch (e) { return json({ ok: false, error: 'bad JSON' }, 400, c.headers); }
    const prompt = typeof body.prompt === 'string' ? body.prompt.slice(0, MAX_PROMPT) : '';
    if (!prompt) return json({ ok: false, error: 'prompt missing' }, 400, c.headers);
    const images = [];
    for (const im of (Array.isArray(body.images) ? body.images : []).slice(0, MAX_IMAGES)) {
      const m = typeof im === 'string' && /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(im);
      if (!m || m[2].length > MAX_IMAGE_B64) return json({ ok: false, error: 'bad image (jpeg/png/webp data URL, up to ~1.2 MB)' }, 400, c.headers);
      images.push({ mime: m[1], b64: m[2] });
    }
    try {
      const text = provider === 'anthropic' ? await callAnthropic(env, model, prompt, images) : provider === 'gemini' ? await callGemini(env, model, prompt, images) : await callOpenRouter(env, model, prompt, images);
      return json({ ok: true, provider, model, json: parseModelJson(text) }, 200, c.headers);
    } catch (e) {
      const st = e && e.status === 429 ? 429 : 502;
      return json({ ok: false, error: String(e && e.message || e).slice(0, 300) }, st, c.headers);
    }
  },
};
