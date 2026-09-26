import axios from 'axios';

const QUERY = 'order-by=newest&show-fields=byline%2Cthumbnail%2Cheadline%2CbodyText';

// The portfolio's demo build sets VITE_NEWS_URL to its own proxy, which adds
// the Guardian key on the server, so no key ships in the demo bundle.
function newsUrl() {
  const proxy = import.meta.env.VITE_NEWS_URL;
  if (proxy) return `${proxy}/search?${QUERY}`;
  return `https://content.guardianapis.com/search?${QUERY}&api-key=${import.meta.env.VITE_GUARDIAN_API_KEY}`;
}

export const getNewsData = async () => {
    try {
        const responseData = await axios.get(newsUrl());
        return responseData.data;
    }

    catch (error) {
      return error;
    }
}
