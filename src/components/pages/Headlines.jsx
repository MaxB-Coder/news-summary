import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';  

import { processId } from '../../utils/processId.js';

const Headlines = ({ newsData }) => {

    const navigate = useNavigate()
    
    const processedData = newsData?.response?.results;

    return (
        <>
            <div className="container py-5">     
                <div className="headline row d-flex justify-content-center">
                    {processedData?.map((processedData) => {
                        return (
                            <article className="col-5" key={processedData.id}>
                                <div className="card my-1 m-2" onClick={() => navigate(`/article/${processId(processedData.id)}`)}>
                                    <img id="Thumbnail" src={processedData.fields.thumbnail} alt="Article Thumbnail" className="card-img-top" />
                                    <h6 className="card-body">{processedData.fields.headline}</h6>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

Headlines.defaultProps = {
  newsData: {
    response: {
      results: []
    }
  }
};

Headlines.propTypes = {
    newsData: PropTypes.shape({
        response: PropTypes.shape({
            results: PropTypes.arrayOf(
                PropTypes.object
            ),
        }),
    }),
}
export default Headlines;