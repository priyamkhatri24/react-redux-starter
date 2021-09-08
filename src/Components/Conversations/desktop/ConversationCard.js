import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import MobileConversationCard from '../mobile/MobileConversationCard';

const ConversationCard = function (props) {
  const { name, subTitle, unreadCount, thumbnail, conversations, onConversationSelected } = props;

  const sideShadowStyle = {
    borderRight: '1px solid #ccc',
    boxShadow: '7px 0px 15px -10px rgba(0,0,0,0.75)',
  };

  return (
    <Container fluid className='pt-3 pb-3' style={sideShadowStyle}>
      <h5 className='pb-2'>Conversations</h5>

      <Row style={{ minWidth: '300px' }} className='conversations-container overflow-auto'>
        <Col xs={0} md={18}>
          {conversations.length > 0 && (
            <ul className='list-unstyled'>
              {conversations.map((data) => (
                <MobileConversationCard
                  key={data.id}
                  name={data.name}
                  subTitle={data.subTitle}
                  unreadCount={data.unreadCount}
                  thumbnail={data.thumbnail}
                  onClick={() => props.onConversationSelected(data)}
                />
              ))}
            </ul>
          )}
        </Col>
      </Row>
    </Container>
  );
};

ConversationCard.propTypes = {
  name: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  subTitle: PropTypes.instanceOf(Object).isRequired,
  unreadCount: PropTypes.number.isRequired,
  conversations: PropTypes.arrayOf(PropTypes.object.isRequired),
  onConversationSelected: PropTypes.func.isRequired,
};

ConversationCard.defaultProps = {
  conversations: [],
};

export default ConversationCard;
