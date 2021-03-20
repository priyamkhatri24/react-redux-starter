import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Message from '../Message/Message';
import './Messages.scss';

const Messages = function ({ list }) {
  const messagesEnd = useRef(null);

  useEffect(function () {
    messagesEnd.current.scrollIntoView();
  });

  return (
    <div className='messages-container container-fluid'>
      {list.map((data) => (
        <Message
          username={data.username}
          message={data.message}
          thumbnail={data.thumbnail}
          userIsAuthor={data.userIsAuthor}
          timestamp={data.timestamp}
        />
      ))}
      <span ref={messagesEnd} style={{ visibility: 'hidden' }} />
    </div>
  );
};

Messages.propTypes = {
  list: PropTypes.arrayOf({
    username: PropTypes.string.isRequired,
    message: PropTypes.objectOf({
      type: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    }),
    thumbnail: PropTypes.string.isRequired,
    userIsAuthor: PropTypes.bool.isRequired,
    timestamp: PropTypes.string.isRequired,
  }).isRequired,
};

export default Messages;
