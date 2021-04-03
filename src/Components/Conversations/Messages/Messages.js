import React, { useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
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

  return (
    <div className='messages-container container-fluid mt-5 mb-5'>
      <InfiniteScroll
        inverse
        dataLength={list.length}
        next={() => loadMore(nextPage)}
        hasMore={!!nextPage}
        /* eslint react/jsx-wrap-multilines: 0 */
        loader={
          <div
            style={{ height: '100px' }}
            className='d-flex align-items-center justify-content-center'
          >
            <Spinner animation='border' variant='primary' />
          </div>
        }
        endMessage={<div style={{ height: '100px' }} />}
        style={{ display: 'flex', flexDirection: 'column-reverse' }}
        height='80vh'
      >
        {list
          .map((data) => (
            <Message
              id={data.id}
              username={data.username}
              message={data.message}
              thumbnail={data.thumbnail}
              userIsAuthor={data.userIsAuthor}
              timestamp={data.timestamp}
              onReactionToMessage={onReactionToMessage}
              reactions={data.reactions}
              userHasReacted={data.userHasReacted}
              isLoading={data.isLoading}
              onSlide={onSlide}
            />
          ))
          .reverse()}
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
