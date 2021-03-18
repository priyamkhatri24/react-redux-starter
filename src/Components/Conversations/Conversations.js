import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ConversationCard from './desktop/ConversationCard';
import MobileConversationCard from './mobile/MobileConversationCard';
import FocusedConversation from './desktop/FocusedConversation';
import ConversationsHeader from './ConversationsHeader';
import './Conversations.scss';

const Conversations = function () {
  return (
    <Container fluid>
      <Row className='d-none d-md-flex'>
        <Col md={3}>
          <h5 className='heading'>Chats</h5>
          <ConversationCard />
        </Col>
        <Col md={9}>
          <FocusedConversation />
        </Col>
      </Row>
      <Row className='d-block d-md-none'>
        <ConversationsHeader />
        <Col md={3}>
          {/* <h5 className='heading pt-2'>Chats</h5> */}

          <div className='conversations-container overflow-auto mt-3'>
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
