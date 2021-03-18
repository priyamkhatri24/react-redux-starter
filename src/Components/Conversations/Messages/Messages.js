import React, { useRef, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Message from '../Message/Message';
import './Messages.scss';

const Messages = function () {
  const messagesEnd = useRef(null);

  useEffect(() => messagesEnd.current.scrollIntoView(), []);

  return (
    <div className='messages-container container-fluid'>
      <Message
        username='Kaushik'
        message={{ type: 'text', content: 'Hello' }}
        thumbnail='https://i.pravatar.cc/30'
      />
      <Message
        username='Kaushik'
        message={{ type: 'text', content: 'Hello' }}
        thumbnail='https://i.pravatar.cc/30'
      />
      <Message
        username='Kaushik'
        message={{ type: 'text', content: 'Hello' }}
        thumbnail='https://i.pravatar.cc/30'
        userIsAuthor
      />
      <span ref={messagesEnd} style={{ visibility: 'hidden' }}>
        END
      </span>
    </div>
  );
};

export default Messages;
