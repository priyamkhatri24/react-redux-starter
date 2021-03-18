import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ConversationCard from './desktop/ConversationCard';
import MobileConversationCard from './mobile/MobileConversationCard';
import FocusedConversation from './desktop/FocusedConversation';
import ConversationsHeader from './ConversationsHeader';
import './Conversations.scss';

const Conversations = function () {
  const [conversations, setConversations] = useState([]);

  useEffect(function () {
    setConversations([
      {
        name: 'Aakash Gupta',
        subTitle: 'Hello, how are you?',
        unreadCount: 5,
      },
      {
        name: 'Kaushik ASP',
        subTitle: 'Assignments are pending',
        unreadCount: 15,
      },
      {
        name: 'Master',
        subTitle: 'Where are you?',
        unreadCount: 0,
      },
    ]);
  }, []);

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
              {conversations.map((data) => (
                <MobileConversationCard
                  name={data.name}
                  subTitle={data.subTitle}
                  unreadCount={data.unreadCount}
                />
              ))}
            </ul>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Conversations;
