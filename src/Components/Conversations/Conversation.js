import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MobileConversationCard from './mobile/MobileConversationCard';
import FocusedConversation from './mobile/FocusedConversation';
import ConversationHeader from './ConversationHeader';
import './Conversations.scss';

const Conversation = function () {
  return (
    <div>
      <ConversationHeader
        thumbnail='https://i.pravatar.cc/40'
        name='Master Group'
        participantsCount={5}
      />
      <Row>
        <Col md={10}>
          <FocusedConversation />
        </Col>
      </Row>
    </div>
  );
};

export default Conversation;
