import axios from 'axios';

export const getNewsData = async () => {
    try {
        const responseData = await axios.get(`https://content.guardianapis.com/search?order-by=newest&show-fields=byline%2Cthumbnail%2Cheadline%2CbodyText&api-key=9bdf4ec1-4046-47af-b015-a884e07daf78`);
        return responseData.data;
    }

    catch (error) {
      return error;
    }
}