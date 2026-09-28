// The Guardian's `body` field is the article's HTML. Only the text of its
// paragraphs and subheadings is kept, so none of that HTML ever reaches the
// page. `bodyText` has no paragraph breaks, so it is only the fallback.
export const articleBlocks = (fields) => {
  if (fields?.body) {
    // DOMParser builds an inert document: no scripts run, no images load
    const doc = new DOMParser().parseFromString(fields.body, 'text/html');
    const blocks = [...doc.querySelectorAll('p, h2')]
      .map((el) => ({ type: el.tagName === 'H2' ? 'h2' : 'p', text: el.textContent.trim() }))
      .filter((block) => block.text);
    if (blocks.length) return blocks;
  }
  return fields?.bodyText ? [{ type: 'p', text: fields.bodyText }] : [];
};
