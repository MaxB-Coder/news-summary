import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { getNewsData } from '../src/utils/newsDataService';

vi.mock('../src/utils/newsDataService');

afterEach(() => {
  vi.resetAllMocks();
});

describe('App', () => {
  it('says so when the headlines could not be loaded', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    getNewsData.mockResolvedValueOnce(new Error('Request failed with status code 502'));

    render(<MemoryRouter><App /></MemoryRouter>);

    expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't load today's headlines");
  });
});
