import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ArticlePage from '../src/components/pages/ArticlePage';
import { articleBlocks } from '../src/utils/articleBlocks';

const BODY =
  '<p>First paragraph, with a <a href="https://example.com">link</a>.</p>' +
  '<figure><img src="https://example.com/x.jpg"><figcaption>A caption</figcaption></figure>' +
  '<h2>A subheading</h2>' +
  '<p>Second paragraph.</p><p> </p>' +
  '<script>window.hacked = true</script><p>&lt;b&gt;not bold&lt;/b&gt;</p>';

describe('articleBlocks', () => {
  it('keeps the paragraphs and subheadings of the article, as plain text', () => {
    expect(articleBlocks({ body: BODY, bodyText: 'ignored' })).toEqual([
      { type: 'p', text: 'First paragraph, with a link.' },
      { type: 'h2', text: 'A subheading' },
      { type: 'p', text: 'Second paragraph.' },
      { type: 'p', text: '<b>not bold</b>' },
    ]);
    expect(window.hacked).toBeUndefined();
  });

  it('falls back to the plain body text when there is no body', () => {
    expect(articleBlocks({ bodyText: 'Just text.' })).toEqual([{ type: 'p', text: 'Just text.' }]);
    expect(articleBlocks(undefined)).toEqual([]);
  });
});

describe('the article page', () => {
  it('shows each paragraph on its own, with the byline and a link to the Guardian', () => {
    const newsData = {
      response: {
        results: [
          {
            id: 'world/2026/sep/28/some-story',
            webUrl: 'https://www.theguardian.com/world/2026/sep/28/some-story',
            fields: { headline: 'Some story', byline: 'A Reporter', thumbnail: 'https://example.com/t.jpg', body: BODY },
          },
        ],
      },
    };
    render(
      <MemoryRouter initialEntries={['/article/some-story']}>
        <Routes>
          <Route path="/article/:id" element={<ArticlePage newsData={newsData} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Some story' })).toBeInTheDocument();
    expect(screen.getByText('A Reporter')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'A subheading' })).toBeInTheDocument();
    expect(screen.getByText('Second paragraph.').tagName).toBe('P');
    expect(screen.getByRole('link', { name: /Read it on the Guardian/ })).toHaveAttribute(
      'href',
      'https://www.theguardian.com/world/2026/sep/28/some-story'
    );
  });
});
