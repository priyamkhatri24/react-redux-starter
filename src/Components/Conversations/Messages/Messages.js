import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Message from '../Message/Message';
import './Messages.scss';

const Messages = function ({ list }) {
  const messagesEnd = useRef(null);

  // useEffect(function () {
  //   messagesEnd.current.scrollIntoView();
  //   setMessages([
  //     {
  //       username: 'Kaushik',
  //       message: { type: 'text', content: 'Hello' },
  //       thumbnail: 'https://i.pravatar.cc/30',
  //       userIsAuthor: false,
  //     },
  //     {
  //       username: 'Pramudit',
  //       message: { type: 'text', content: 'Hey!' },
  //       thumbnail: 'https://i.pravatar.cc/30',
  //       userIsAuthor: true,
  //     },
  //   ]);
  // }, []);

  return (
    <div className='messages-container container-fluid'>
      {list.map((data) => (
        <Message
          username={data.username}
          message={data.message}
          thumbnail={data.thumbnail}
          userIsAuthor={data.userIsAuthor}
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
  }).isRequired,
};

export default Messages;
