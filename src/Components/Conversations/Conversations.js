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
import { formatConversations } from './formatter';
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

  const fetchConversations = function () {
    get(null, `/getConversationsOfUser?client_user_id=${clientUserId}`).then((res) => {
      console.log(res, 'balleee');
      const data = apiValidation(res);
      setConversations(formatConversations(data));
    });
  };

  const onConversationSelected = function (conversation) {
    setConversation(conversation);
    history.push('/conversation');
  };
  const onConversationSelectedDesk = function (conversation) {
    setConversation(conversation);
  };

  return (
    <Container style={{ height: '100vh' }} fluid>
      {/* <Row className='d-none d-md-flex'>
        <Col style={{ maxWidth: '360px' }} md={4}>
          <h5 className='heading'>Chats</h5>
          <ConversationCard
            conversations={conversations}
           
            onConversationSelected={onConversationSelectedDesk}
          />
        </Col>
        <Col style={{ width: '100%' }}>
          <FocusedConversation />
        </Col>
      </Row> */}
      <Row className='d-block'>
        <ConversationsHeader />
        <div className='d-flex'>
          <Col style={{ overflowY: 'scroll' }} md={12}>
            <div className='conversations-container mt-3'>
              {conversations.length > 0 && (
                <ul className='list-unstyled'>
                  {conversations.map((data) => (
                    <MobileConversationCard
                      key={data.id}
                      name={data.name}
                      subTitle={data.subTitle}
                      unreadCount={data.unreadCount}
                      thumbnail={data.thumbnail}
                      onClick={() => onConversationSelected(data)}
                    />
                  ))}
                </ul>
              )}
              {conversations.length === 0 && (
                <p className='text-center'>Seems like you dont have any chats</p>
              )}
            </div>
          </Col>
        </div>
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
