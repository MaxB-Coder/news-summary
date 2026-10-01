// Guardian search for the Vercel deployment, with the key kept on the server
// (the GUARDIAN_KEY environment variable). Same path and rules as
// maxblaschek.com's proxy, so one build of the app works on both.
const FIELDS = new Set(['body', 'byline', 'thumbnail', 'headline', 'bodyText', 'trailText']);
const ORDERS = new Set(['newest', 'oldest', 'relevance']);

/** Each allowed parameter and how to check (and normalise) its value. */
const PARAMS = {
  'order-by': (v) => (ORDERS.has(v) ? v : null),
  'show-fields': (v) => {
    const fields = v.split(',').map((f) => f.trim());
    return fields.every((f) => FIELDS.has(f)) ? fields.sort().join(',') : null;
  },
  page: (v) => (/^\d+$/.test(v) && +v >= 1 && +v <= 20 ? v : null),
  'page-size': (v) => (/^\d+$/.test(v) && +v >= 1 && +v <= 50 ? v : null),
  q: (v) => (v.trim().length >= 1 && v.trim().length <= 100 ? v.trim().toLowerCase() : null),
  section: (v) => (/^[a-z-]{1,40}$/.test(v) ? v : null),
};

export default async function handler(req, res) {
  // Browsers say where a request comes from; only the app itself may use this
  const site = req.headers['sec-fetch-site'];
  if (site && site !== 'same-origin') return res.status(403).json({ error: 'Not allowed' });

  const query = new URLSearchParams();
  for (const [name, value] of Object.entries(req.query)) {
    const normalised = PARAMS[name]?.(String(value)) ?? null;
    if (normalised === null) return res.status(400).json({ error: `${name} is not allowed here` });
    query.set(name, normalised);
  }

  const key = process.env.GUARDIAN_KEY;
  if (!key) return res.status(500).json({ error: 'GUARDIAN_KEY is not set on the server' });

  query.sort();
  query.set('api-key', key);
  const upstream = await fetch(`https://content.guardianapis.com/search?${query}`);
  if (!upstream.ok) return res.status(502).json({ error: 'news request failed' });

  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
  return res.status(200).json(await upstream.json());
}
