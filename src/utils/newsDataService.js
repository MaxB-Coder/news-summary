import axios from 'axios';

const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;

export const getNewsData = async () => {
    try {
        const responseData = await axios.get(`https://content.guardianapis.com/search?order-by=newest&show-fields=byline%2Cthumbnail%2Cheadline%2CbodyText&api-key=${GUARDIAN_API_KEY}`);
        return responseData.data;
    }

    catch (error) {
      return error;
    }
}