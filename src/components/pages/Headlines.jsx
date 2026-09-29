import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { processId } from '../../utils/processId.js';
import { timeAgo } from '../../utils/timeAgo.js';

/** The opening of a story, cut at a word, for under the lead headline. */
const standfirst = (text = '', length = 180) =>
  text.length <= length ? text : `${text.slice(0, text.lastIndexOf(' ', length))}…`;

const Story = ({ story, lead }) => {
  const Heading = lead ? 'h2' : 'h3';
  const { headline, thumbnail, bodyText } = story.fields;
  const live = story.type === 'liveblog';
  return (
    <article className={lead ? 'story story-lead' : 'story'}>
      <Link to={`/article/${processId(story.id)}`} className='story-link'>
        {thumbnail && (
          <div className='story-image'>
            <img src={thumbnail} alt='' loading={lead ? 'eager' : 'lazy'} />
          </div>
        )}
        <div className='story-text'>
          <p className='story-kicker'>
            {live && <span className='live'>Live</span>}
            {story.sectionName}
          </p>
          <Heading className='story-headline'>{headline}</Heading>
          {/* A live blog's text starts with its timestamps, so it has no standfirst */}
          {lead && !live && bodyText && <p className='story-standfirst'>{standfirst(bodyText)}</p>}
          <p className='story-meta'>
            <time dateTime={story.webPublicationDate}>{timeAgo(story.webPublicationDate)}</time>
          </p>
        </div>
      </Link>
    </article>
  );
};

Story.propTypes = {
  story: PropTypes.object.isRequired,
  lead: PropTypes.bool,
};

// React 19 ignores defaultProps on function components, so the default lives here
const NO_NEWS = { response: { results: [] } };

const Headlines = ({ newsData = NO_NEWS }) => {
  const results = newsData?.response?.results ?? [];
  if (!results.length) return null;
  const [lead, ...rest] = results;

  return (
    <div className='headlines'>
      <Story story={lead} lead />
      <div className='story-grid'>
        {rest.map((story) => (
          <Story key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
};

Headlines.propTypes = {
  newsData: PropTypes.shape({
    response: PropTypes.shape({
      results: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
};

export default Headlines;
