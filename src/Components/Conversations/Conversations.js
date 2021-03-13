import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ConversationCard from './ConversationCard';
import MobileConversationCard from './MobileConversationCard';
import FocusedConversation from './FocusedConversation';
import './Conversations.scss';

const Conversations = function () {
  return (
    <Container fluid>
      <Row className='d-none d-md-block'>
        <Col md={3}>
          <ConversationCard />
        </Col>
        <Col md={9}>
          <FocusedConversation />
        </Col>
      </Row>
      <Row className='d-block d-md-none'>
        <Col md={3}>
          <MobileConversationCard />
        </Col>
      </Row>
    </Container>
  );
};

export default Conversations;
