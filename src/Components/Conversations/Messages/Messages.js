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
          id={data.id}
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
  list: PropTypes.arrayOf(PropTypes.objectOf(Message).isRequired).isRequired,
};

export default Messages;
