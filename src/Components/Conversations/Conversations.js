import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { get, apiValidation } from '../../Utilities';
import ConversationCard from './desktop/ConversationCard';
import MobileConversationCard from './mobile/MobileConversationCard';
import FocusedConversation from './desktop/FocusedConversation';
import ConversationsHeader from './ConversationsHeader';
import { conversationsActions } from '../../redux/actions/conversations.action';
import { getConversations } from '../../redux/reducers/conversations.reducer';
import './Conversations.scss';

const Conversations = function ({ conversations, setConversations, setConversation }) {
  const history = useHistory();

  const fetchConversations = function () {
    get(null, '/getConversationsOfUser?client_user_id=1801').then((res) => {
      console.log(res);
      const data = apiValidation(res);
      setConversations(
        data.map((conversation) => ({
          id: conversation.conversation_id,
          name: conversation.name,
          thumbnail: conversation.display_picture || 'https://i.pravatar.cc/40',
          subTitle: conversation.last_message || '',
          unreadCount: conversation.unread_message_count || 0,
        })),
      );
    });
  };

  const onConversationSelected = function (id, name, thumbnail) {
    console.log('Clicked');
    setConversation({ id, messages: [], name, thumbnail, participantsCount: null });
    // localStorage.setItem('selectedConversation', id);
    history.push('/conversation');
  };

  useEffect(function () {
    fetchConversations();
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
          <div className='conversations-container overflow-auto mt-3'>
            {conversations.length > 0 && (
              <ul className='list-unstyled'>
                {conversations.map((data) => (
                  <MobileConversationCard
                    name={data.name}
                    subTitle={data.subTitle}
                    unreadCount={data.unreadCount}
                    thumbnail={data.thumbnail}
                    onClick={() => onConversationSelected(data.id, data.name, data.thumbnail)}
                  />
                ))}
              </ul>
            )}
            {conversations.length === 0 && (
              <p className='text-center'>Seems like you dont have any chats</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  conversations: getConversations(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setConversations: (conversations) => {
      dispatch(conversationsActions.setConversations(conversations));
    },
    setConversation: (conversation) => {
      dispatch(conversationsActions.setConversation(conversation));
    },
  };
};

Conversations.propTypes = {
  setConversations: PropTypes.func.isRequired,
  setConversation: PropTypes.func.isRequired,
  conversations: PropTypes.arrayOf({
    name: PropTypes.string.isRequired,
    unreadCount: PropTypes.number,
    id: PropTypes.number.isRequired,
    subTitle: PropTypes.string,
  }),
};

Conversations.defaultProps = {
  conversations: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(Conversations);
