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
import { getConversations, getSocket } from '../../redux/reducers/conversations.reducer';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import './Conversations.scss';

const Conversations = function ({
  conversations,
  setConversations,
  setConversation,
  socket,
  clientUserId,
}) {
  const history = useHistory();

  useEffect(function () {
    fetchConversations();

    socket.emit('user-connected', { client_user_id: clientUserId });
    console.log(socket);
    socket.on('receiveMessage', addMessageToConversation);

    return () => {
      socket.off('receiveMessage', addMessageToConversation);
    };
  }, []);

  const addMessageToConversation = function (data) {
    console.log(data, 'receiveMessage emitted from Conversations');
    const conversationIndex = conversations.findIndex((c) => c.id === data.conversation_id);
    if (conversationIndex === -1) return;

    const newConversations = [...conversations];
    const conversation = newConversations[conversationIndex];
    conversation.subTitle = data.text;
    newConversations.splice(conversationIndex, 1);
    newConversations.unshift(conversation);
    setConversations(newConversations);
  };

  function send() {
    socket.emit('sendMessage', {
      sender_id: 1801,
      conversation_id: 2,
      chat_text: `Hello last message - ${Math.random()}`,
      type: 'message',
      attachments_array: [],
    });
  }

  const fetchConversations = function () {
    get(null, `/getConversationsOfUser?client_user_id=${clientUserId}`).then((res) => {
      console.log(res);
      const data = apiValidation(res);
      setConversations(
        data.map((conversation) => ({
          id: conversation.conversation_id,
          name: conversation.name,
          thumbnail: conversation.display_picture || 'https://i.pravatar.cc/40',
          subTitle: conversation.last_message || '',
          unreadCount: conversation.unread_message_count || 0,
          messages: [],
        })),
      );
    });
  };

  const onConversationSelected = function (id, name, thumbnail) {
    setConversation({ id, messages: [], name, thumbnail, participantsCount: null });
    history.push('/conversation');
  };

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
                    key={data.id}
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
          {/* <button type='button' onClick={() => send()}>
            Send
          </button> */}
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  conversations: getConversations(state),
  socket: getSocket(state),
  clientUserId: getClientUserId(state),
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
  clientUserId: PropTypes.number.isRequired,
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
  conversations: PropTypes.arrayOf(PropTypes.object.isRequired),
};

Conversations.defaultProps = {
  conversations: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(Conversations);
