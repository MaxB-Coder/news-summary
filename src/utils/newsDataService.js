import axios from 'axios';

const FIELDS = 'order-by=newest&show-fields=byline%2Cthumbnail%2Cheadline%2CbodyText';
// The article HTML, for its paragraphs (see utils/articleBlocks.js)
const QUERY = `${FIELDS}%2Cbody`;

// Production builds set VITE_NEWS_URL (see .env.production) to a proxy on their
// own origin, which adds the Guardian key on the server, so no key ships in the bundle.
function newsUrl(query) {
  const proxy = import.meta.env.VITE_NEWS_URL;
  if (proxy) return `${proxy}/search?${query}`;
  return `https://content.guardianapis.com/search?${query}&api-key=${import.meta.env.VITE_GUARDIAN_API_KEY}`;
}

export const getNewsData = async () => {
    try {
        const responseData = await axios.get(newsUrl(QUERY));
        return responseData.data;
    }

    catch (error) {
      // A proxy that doesn't allow the body yet: fall back to the plain text
      if (error?.response?.status === 400) return getNewsDataWithoutBody();
      return error;
    }
}

const getNewsDataWithoutBody = async () => {
    try {
        const responseData = await axios.get(newsUrl(FIELDS));
        return responseData.data;
    }

    catch (error) {
      return error;
    }
}
