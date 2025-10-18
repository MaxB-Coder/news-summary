import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { processId } from '../../utils/processId.js';

const Headlines = ({ newsData }) => {
  const navigate = useNavigate();
  const processedData = newsData?.response?.results;

  return (
    <>
      <div className='container py-5'>
        <div className='headline row d-flex justify-content-center'>
          {processedData?.map((processedData) => (
            <article
              key={processedData.id}
              className='col-12 col-md-6 col-lg-5 d-flex justify-content-center'
            >
              <div
                className='card my-3 mx-2 w-100'
                onClick={() =>
                  navigate(`/article/${processId(processedData.id)}`)
                }
              >
                <img
                  id='Thumbnail'
                  src={processedData.fields.thumbnail}
                  alt='Article Thumbnail'
                  className='card-img-top'
                />
                <h6 className='card-body'>{processedData.fields.headline}</h6>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
};

Headlines.defaultProps = {
  newsData: {
    response: {
      results: [],
    },
  },
};

Headlines.propTypes = {
  newsData: PropTypes.shape({
    response: PropTypes.shape({
      results: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
};

export default Headlines;
