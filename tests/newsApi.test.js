// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import handler from '../api/news/search.js';

/** Just enough of Vercel's request and response for the handler. */
function call(query, headers = { 'sec-fetch-site': 'same-origin' }) {
  const res = { statusCode: 200, headers: {}, body: undefined };
  res.status = (code) => ((res.statusCode = code), res);
  res.setHeader = (name, value) => (res.headers[name.toLowerCase()] = value);
  res.json = (body) => ((res.body = body), res);
  return handler({ query, headers }, res).then(() => res);
}

const HEADLINES = { 'order-by': 'newest', 'show-fields': 'byline,thumbnail,headline,bodyText,body' };

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('the news proxy on Vercel', () => {
  it('searches the Guardian with the server-side key, and caches for ten minutes', async () => {
    vi.stubEnv('GUARDIAN_KEY', 'server-key');
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ response: { results: [] } })));
    vi.stubGlobal('fetch', fetch);

    const res = await call(HEADLINES);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ response: { results: [] } });
    const upstream = new URL(fetch.mock.calls[0][0]);
    expect(upstream.origin + upstream.pathname).toBe('https://content.guardianapis.com/search');
    expect(upstream.searchParams.get('order-by')).toBe('newest');
    expect(upstream.searchParams.get('show-fields')).toBe('body,bodyText,byline,headline,thumbnail');
    expect(upstream.searchParams.get('api-key')).toBe('server-key');
    expect(res.headers['cache-control']).toContain('s-maxage=600');
    expect(JSON.stringify(res)).not.toContain('server-key');
  });

  it.each([
    ['an unknown parameter', { 'api-key': 'mine' }],
    ['an unknown field', { 'show-fields': 'wordcount' }],
    ['a bad order', { 'order-by': 'random' }],
    ['a page out of range', { page: '500' }],
  ])('rejects %s without calling the Guardian', async (_name, query) => {
    vi.stubEnv('GUARDIAN_KEY', 'server-key');
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    expect((await call(query)).statusCode).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('only answers the app itself, not other websites', async () => {
    vi.stubEnv('GUARDIAN_KEY', 'server-key');
    vi.stubGlobal('fetch', vi.fn());
    expect((await call(HEADLINES, { 'sec-fetch-site': 'cross-site' })).statusCode).toBe(403);
  });

  it('says so when the Guardian fails', async () => {
    vi.stubEnv('GUARDIAN_KEY', 'server-key');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('nope', { status: 401 })));
    expect((await call(HEADLINES)).statusCode).toBe(502);
  });
});
