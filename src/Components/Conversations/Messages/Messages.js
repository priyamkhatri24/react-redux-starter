import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Message from '../Message/Message';
import './Messages.scss';

const Messages = function ({ list, onReactionToMessage }) {
  const messagesEnd = useRef(null);

  useEffect(function () {
    setTimeout(
      () =>
        // { behavior: 'smooth' }
        messagesEnd.current !== null && messagesEnd.current.scrollIntoView(),
      500,
    );
  }, []);

  useEffect(function () {
    // { behavior: 'smooth' }
    messagesEnd.current !== null && messagesEnd.current.scrollIntoView();
  });

  return (
    <div className='messages-container container-fluid'>
      {list.map((data) => (
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
        />
      ))}
      <span ref={messagesEnd} style={{ visibility: 'hidden' }} />
    </div>
  );
};

Messages.propTypes = {
  list: PropTypes.arrayOf(PropTypes.objectOf(Message).isRequired).isRequired,
  onReactionToMessage: PropTypes.func.isRequired,
};

export default Messages;
