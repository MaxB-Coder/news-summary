import axios from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getNewsData } from '../src/utils/newsDataService';

vi.mock('axios');

const FIELDS = 'order-by=newest&show-fields=byline%2Cthumbnail%2Cheadline%2CbodyText';

afterEach(() => {
  vi.resetAllMocks();
  vi.unstubAllEnvs();
});

describe('where getNewsData asks for the news', () => {
  it('calls the Guardian directly with the local key', async () => {
    vi.stubEnv('VITE_GUARDIAN_API_KEY', 'local-key');
    axios.get.mockResolvedValueOnce({ data: {} });
    await getNewsData();
    expect(axios.get).toHaveBeenCalledWith(`https://content.guardianapis.com/search?${FIELDS}&api-key=local-key`);
  });

  it('uses the proxy, without a key, when one is configured', async () => {
    vi.stubEnv('VITE_GUARDIAN_API_KEY', 'local-key');
    vi.stubEnv('VITE_NEWS_URL', '/api/news');
    axios.get.mockResolvedValueOnce({ data: {} });
    await getNewsData();
    expect(axios.get).toHaveBeenCalledWith(`/api/news/search?${FIELDS}`);
  });
});
