import React, { useRef, useEffect, forwardRef, useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import InfiniteScrollComponent from 'react-infinite-scroll-component';
import Message from '../Message/Message';
import './Messages.scss';

const Messages = forwardRef(
  (
    {
      list,
      onReactionToMessage,
      onSlide,
      isLoading,
      loadMore,
      nextPage,
      deleteMessage,
      role,
      action,
      conversations,
    },
    ref,
  ) => {
    const messagesEnd = useRef(null);
    const scrollParent = useRef(null);
    const [newMessageContainer, setNewMessageContainer] = useState(false);

    useEffect(() => {}, []);

    useEffect(
      function () {
        if (scrollParent && scrollParent.current) {
          console.log(scrollParent.current.scrollTop, 'scrollTopppp');
        }
        if (action !== 'delete' && action !== 'fetch' && action !== 'recieve') {
          messagesEnd.current !== null && messagesEnd.current.scrollIntoView();
        }
        if (action === 'fetchpost') {
          messagesEnd.current !== null && messagesEnd.current.scrollIntoView();
        }
        if (scrollParent && scrollParent.current.scrollTop > -200 && action === 'recieve') {
          messagesEnd.current !== null && messagesEnd.current.scrollIntoView();
          setNewMessageContainer(false);
        } else if (scrollParent && scrollParent.current.scrollTop < -200 && action === 'recieve') {
          setNewMessageContainer(true);
        }
      },
      [list],
    );

    const keepBottom = () => {
      window.scrollTo(0, document.body.clientHeight + 10);
    };

    const scrollToBottomAndRemoveContainer = () => {
      messagesEnd.current !== null && messagesEnd.current.scrollIntoView({ behaviour: 'smooth' });
      setNewMessageContainer(false);
    };

    // useEffect(function () {
    //   console.log(action, 'actionnnnnnnnnn');
    //   if (list.length >= 15 && action !== 'delete' && action !== 'fetch') {
    //     messagesEnd.current !== null && messagesEnd.current.scrollIntoView();
    //   }
    //   if (action === 'fetchpost') {
    //     messagesEnd.current !== null && messagesEnd.current.scrollIntoView();
    //   }
    // });

    // useImperativeHandle(ref, () => ({
    //   scrollIntoView() {
    //     if (action !== 'delete' && action !== 'fetch' && action !== 'recieve') {
    //       messagesEnd.current !== null && messagesEnd.current.scrollIntoView();
    //     }
    //     if (scrollParent && scrollParent.current.scrollTop > -200 && action === 'recieve') {
    //       messagesEnd.current !== null && messagesEnd.current.scrollIntoView();
    //     }
    //   },
    // }));

    const loader = () => {
      return (
        !!nextPage && (
          <div
            style={{ height: '100px' }}
            className='d-flex align-items-center justify-content-center'
          >
            <Spinner animation='border' variant='primary' />
          </div>
        )
      );
    };

    return (
      <div
        className='messages-container desktopContainer container-fluid mt-2'
        ref={scrollParent}
        style={{
          height: '80vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
        id='scrollableDiv'
      >
        {list.length > 0 && (
          <InfiniteScrollComponent
            inverse
            dataLength={list.length}
            next={() => loadMore(nextPage)}
            hasMore={!!nextPage}
            loader={<p />}
            style={{ overflowY: 'auto' }}
            scrollableTarget='scrollableDiv'
          >
            {loader()}
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
                attachmentsArray={data.attachmentsArray}
                deleteMessage={deleteMessage}
                role={role}
                userColor={data.userColor}
              />
            ))}

            <span ref={messagesEnd} style={{ visibility: 'hidden' }} />
          </InfiniteScrollComponent>
        )}

        <div style={{ height: '25px' }} />
        {newMessageContainer ? (
          <button
            onClick={scrollToBottomAndRemoveContainer}
            className='downArrowScroller'
            type='button'
          >
            New messages
            <KeyboardArrowDown />
          </button>
        ) : null}
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
  deleteMessage: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  conversations: PropTypes.instanceOf(Object).isRequired,
};

Messages.defaultProps = {
  onSlide: () => {},
  loadMore: () => {},
  isLoading: false,
};

export default Messages;
