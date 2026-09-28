import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Headlines from '../src/components/pages/Headlines';
import Footer from '../src/components/standard_elements/footer';
import { timeAgo } from '../src/utils/timeAgo';

const HOUR = 60 * 60 * 1000;
const story = (slug, overrides = {}) => ({
  id: `world/2026/sep/28/${slug}`,
  type: 'article',
  sectionName: 'World news',
  webPublicationDate: new Date(Date.now() - 2 * HOUR).toISOString(),
  fields: { headline: `Headline ${slug}`, thumbnail: `https://example.com/${slug}.jpg`, bodyText: 'The first sentence. The second.' },
  ...overrides,
});

function renderHeadlines(results) {
  render(
    <MemoryRouter>
      <Headlines newsData={{ response: { results } }} />
    </MemoryRouter>
  );
}

describe('the headlines', () => {
  it('lead with the first story, and every headline links to its article', () => {
    renderHeadlines([story('one'), story('two'), story('three')]);
    expect(screen.getByRole('heading', { level: 2, name: 'Headline one' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
    expect(screen.getByRole('link', { name: /Headline two/ })).toHaveAttribute('href', '/article/two');
  });

  it('show the section, how long ago, and mark live blogs', () => {
    renderHeadlines([story('one'), story('live-one', { type: 'liveblog', sectionName: 'Sport' })]);
    const live = screen.getByRole('link', { name: /Headline live-one/ });
    expect(within(live).getByText('Live')).toBeInTheDocument();
    expect(live).toHaveTextContent('Sport');
    expect(live).toHaveTextContent('2h ago');
  });
});

describe('timeAgo', () => {
  const now = Date.UTC(2026, 8, 28, 12);
  it('says how long ago, briefly', () => {
    expect(timeAgo(new Date(now - 20 * 1000).toISOString(), now)).toBe('Just now');
    expect(timeAgo(new Date(now - 35 * 60 * 1000).toISOString(), now)).toBe('35m ago');
    expect(timeAgo(new Date(now - 5 * HOUR).toISOString(), now)).toBe('5h ago');
    expect(timeAgo(new Date(now - 50 * HOUR).toISOString(), now)).toBe('2d ago');
  });
});

describe('the footer', () => {
  it('credits the Guardian', () => {
    render(<Footer />);
    expect(screen.getByText(/Powered by the Guardian/)).toBeInTheDocument();
  });
});
