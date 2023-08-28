import { useParams } from "react-router-dom";
import { useEffect } from "react";
import PropTypes from "prop-types";

import { processId } from "../../utils/processId";

const ArticlePage = ({ newsData }) => {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const processedData = newsData?.response?.results;

  const article = processedData?.find(
    (processedData) => processId(processedData?.id) === id
  );

  const thumbnail = article?.fields.thumbnail;
  const headline = article?.fields.headline;
  const bodyText = article?.fields.bodyText;
  const articleLink = article?.webUrl;

  return (
    <>
      <article className="my-5 py-5" key={id}>
        <div className="card mx-5 px-5 text-center d-flex justify-content-center">
          <a className="link-light guardianLink" href={articleLink}>
            <h3 className="card-body pb-4 guardianLink">{headline}</h3>
          </a>
          <img
            id="Thumbnail"
            src={thumbnail}
            alt="Article Thumbnail"
            className="card-img-top col-start-6 px-5 text-center mx-auto w-50"
          />
          <p className="center-text col-10 mx-auto pt-4 px-5">{bodyText}</p>
        </div>
      </article>
    </>
  );
};

ArticlePage.defaultProps = {
  newsData: {
    response: {
      results: [],
    },
  },
};

ArticlePage.propTypes = {
  newsData: PropTypes.shape({
    response: PropTypes.shape({
      results: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
};

export default ArticlePage;
