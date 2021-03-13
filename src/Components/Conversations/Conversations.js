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
          <h5 className='heading'>Chats</h5>
          <ConversationCard />
        </Col>
        <Col md={9}>
          <FocusedConversation />
        </Col>
      </Row>
      <Row className='d-block d-md-none'>
        <Col md={3}>
          <h5 className='heading pt-2'>Chats</h5>

          <div className='conversations-container overflow-auto'>
            <ul className='list-unstyled'>
              <MobileConversationCard name='Aakash Gupta' subTitle='Hello, how are you?' />
              <MobileConversationCard name='Kaushik ASP' subTitle='Assignments are pending' />
              <MobileConversationCard name='Master' subTitle='Where are you?' />
            </ul>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Conversations;
