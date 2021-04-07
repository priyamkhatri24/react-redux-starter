import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'react-bootstrap';
// import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScroll from 'react-infinite-scroller';
import Message from '../Message/Message';
import './Messages.scss';

const Messages = function ({ list, onReactionToMessage, onSlide, isLoading, loadMore, nextPage }) {
  const messagesEnd = useRef(null);

  useEffect(
    function () {
      if (list.length === 15) {
        messagesEnd.current !== null && messagesEnd.current.scrollIntoView();
      }
    },
    [list],
  );

  useEffect(function () {
    if (list.length === 15) {
      messagesEnd.current !== null && messagesEnd.current.scrollIntoView();
    }
  });

  const loader = () => (
    <div style={{ height: '100px' }} className='d-flex align-items-center justify-content-center'>
      <Spinner animation='border' variant='primary' />
    </div>
  );

  return (
    <div
      className='messages-container container-fluid mt-5 mb-5'
      style={{ height: '80vh', overflow: 'auto' }}
    >
      <InfiniteScroll
        isReverse
        dataLength={list.length}
        loadMore={() => loadMore(nextPage)}
        hasMore={!!nextPage}
        initialLoad={false}
        useWindow={false}
        /* eslint react/jsx-wrap-multilines: 0 */
        loader={loader()}
        // }
        // scrollableTarget='parent'
        // style={{ display: 'flex', flexDirection: 'column-reverse' }}
        // height='80vh'
      >
        <div style={{ height: '100px' }} />
        {list.map((data) => (
          <Message
            id={data.id}
            key={data.id}
            username={data.username}
            message={data.message}
            thumbnail={data.thumbnail}
            userIsAuthor={data.userIsAuthor}
            timestamp={data.timestamp}
            onReactionToMessage={onReactionToMessage}
            reactions={data.reactions}
            comments={data.comments}
            userHasReacted={data.userHasReacted}
            isLoading={data.isLoading}
            onSlide={onSlide}
          />
        ))}
      </InfiniteScroll>

      <span ref={messagesEnd} style={{ visibility: 'hidden' }} />
    </div>
  );
};

Messages.propTypes = {
  list: PropTypes.arrayOf(PropTypes.objectOf(Message).isRequired).isRequired,
  onReactionToMessage: PropTypes.func.isRequired,
  onSlide: PropTypes.func,
  loadMore: PropTypes.func,
  isLoading: PropTypes.bool,
  nextPage: PropTypes.number.isRequired,
};

Messages.defaultProps = {
  onSlide: () => {},
  loadMore: () => {},
  isLoading: false,
};

export default Messages;
