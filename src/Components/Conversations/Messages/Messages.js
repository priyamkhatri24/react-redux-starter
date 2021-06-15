import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller';
import Message from '../Message/Message';
import './Messages.scss';

const Messages = forwardRef(
  ({ list, onReactionToMessage, onSlide, isLoading, loadMore, nextPage }, ref) => {
    const messagesEnd = useRef(null);
    const scrollParent = useRef(null);

    useEffect(
      function () {
        if (list.length <= 15) {
          messagesEnd.current !== null && messagesEnd.current.scrollIntoView();
        }
      },
      [list],
    );

    useEffect(function () {
      if (list.length <= 15) {
        messagesEnd.current !== null && messagesEnd.current.scrollIntoView();
      }
    });

    useImperativeHandle(ref, () => ({
      scrollIntoView() {
        messagesEnd.current !== null && messagesEnd.current.scrollIntoView();
      },
    }));

    const loader = () => (
      <div style={{ height: '100px' }} className='d-flex align-items-center justify-content-center'>
        <Spinner animation='border' variant='primary' />
      </div>
    );

    return (
      <div
        className='messages-container container-fluid mt-5 mb-5'
        style={{
          // height: '100vh',
          overflowX: 'hidden',
          overflowY: 'scroll',
        }}
        ref={scrollParent}
      >
        {list.length > 0 && (
          <InfiniteScroll
            isReverse
            loadMore={() => loadMore(nextPage)}
            hasMore={!!nextPage}
            initialLoad={false}
            threshold={500}
            loader={loader()}
            getScrollParent={() => scrollParent.current}
          >
            {list.map((data) => (
              <Message
                id={data.id}
                key={data.id}
                username={data.username}
                message={data.message}
                replyTo={data.replyTo}
                thumbnail={data.thumbnail}
                userIsAuthor={data.userIsAuthor}
                timestamp={data.timestamp}
                onReactionToMessage={onReactionToMessage}
                reactions={data.reactions}
                commentsInfo={data.commentsInfo}
                userHasReacted={data.userHasReacted}
                isLoading={data.isLoading}
                onSlide={onSlide}
              />
            ))}
          </InfiniteScroll>
        )}

        <div style={{ height: '25px' }} />

        <span ref={messagesEnd} style={{ visibility: 'hidden' }} />
      </div>
    );
  },
);

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
