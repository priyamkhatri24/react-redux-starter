import React, { useRef, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Message from '../Message/Message';
import './Messages.scss';

const Messages = function () {
  const messagesEnd = useRef(null);

  useEffect(() => messagesEnd.current.scrollIntoView(), []);

  return (
    <div className='messages-container container-fluid'>
      <Row>
        <Col>
          <Message />
          <Message />
          <Message />
          <Message />
          <Message />
          <Message />
          <Message />
          <Message />
          <Message />
          <Message />
          <Message />
          <Message />
          <Message />
          <Message />
          <Message />
          <Message />
          <Message />
          <span ref={messagesEnd} style={{ visibility: 'hidden' }}>
            END
          </span>
        </Col>
      </Row>
    </div>
  );
};

export default Messages;
