import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { articleBlocks } from '../../utils/articleBlocks';
import { processId } from '../../utils/processId';

const ArticlePage = ({ newsData }) => {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const processedData = newsData?.response?.results;

  const article = processedData?.find(
    (processedData) => processId(processedData?.id) === id
  );

  if (!article) return null;

  const { thumbnail, headline, byline } = article.fields;
  const blocks = articleBlocks(article.fields);

  return (
    <article className='article-page' key={id}>
      <h1 className='article-headline'>{headline}</h1>
      {byline && <p className='article-byline'>{byline}</p>}
      {thumbnail && <img className='article-image' src={thumbnail} alt='' />}
      <div className='article-body'>
        {blocks.map((block, index) =>
          block.type === 'h2' ? <h2 key={index}>{block.text}</h2> : <p key={index}>{block.text}</p>
        )}
      </div>
      <a className='article-source' href={article.webUrl} target='_blank' rel='noreferrer'>
        Read it on the Guardian ↗
      </a>
    </article>
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
