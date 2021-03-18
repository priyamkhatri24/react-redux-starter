import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MobileConversationCard from './mobile/MobileConversationCard';
import FocusedConversation from './mobile/FocusedConversation';
import ConversationHeader from './ConversationHeader';
import Messages from './Messages/Messages';
import './Conversations.scss';

const Conversation = function () {
  return (
    <>
      <div className='fixed-top' style={{ zIndex: 2, backgroundColor: '#fff' }}>
        <ConversationHeader
          thumbnail='https://i.pravatar.cc/40'
          name='Master Group'
          participantsCount={5}
        />
      </div>
      <Row>
        <Col md={12}>
          <FocusedConversation />
        </Col>
      </Row>
    </>
  );
};

export default Conversation;
