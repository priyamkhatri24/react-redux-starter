import React, { useRef, useEffect, useState } from 'react';
import Message from '../Message/Message';
import './Messages.scss';

const Messages = function () {
  const messagesEnd = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(function () {
    messagesEnd.current.scrollIntoView();
    setMessages([
      {
        username: 'Kaushik',
        message: { type: 'text', content: 'Hello' },
        thumbnail: 'https://i.pravatar.cc/30',
        userIsAuthor: false,
      },
      {
        username: 'Pramudit',
        message: { type: 'text', content: 'Hey!' },
        thumbnail: 'https://i.pravatar.cc/30',
        userIsAuthor: true,
      },
    ]);
  }, []);

  return (
    <div className='messages-container container-fluid'>
      {messages.map((data) => (
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

export default Messages;
