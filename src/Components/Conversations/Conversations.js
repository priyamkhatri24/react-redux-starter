import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';
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
import './Conversations.scss';

const SERVER = 'http://13.126.247.152:3000';

const Conversations = function ({
  conversations,
  setConversations,
  setConversation,
  socket,
  setSocket,
}) {
  const history = useHistory();

  useEffect(function () {
    fetchConversations();
    const socketInstance = io(SERVER, { transports: ['websocket'] });
    socketInstance.on('connect', () => {
      console.log(socketInstance.id, 'connect');
    });

    socketInstance.on('disconnect', () => {
      console.log(socketInstance.id, 'disconnected');
    });

    setSocket({ socket: socketInstance });
  }, []);

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
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  conversations: getConversations(state),
  socket: getSocket(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setConversations: (conversations) => {
      dispatch(conversationsActions.setConversations(conversations));
    },
    setConversation: (conversation) => {
      dispatch(conversationsActions.setConversation(conversation));
    },
    setSocket: (socket) => {
      dispatch(conversationsActions.setSocket(socket));
    },
  };
};

Conversations.propTypes = {
  setConversations: PropTypes.func.isRequired,
  setConversation: PropTypes.func.isRequired,
  setSocket: PropTypes.func.isRequired,
  socket: PropTypes.objectOf(PropTypes.any),
  conversations: PropTypes.arrayOf(PropTypes.object.isRequired),
};

Conversations.defaultProps = {
  conversations: [],
  socket: {},
};

export default connect(mapStateToProps, mapDispatchToProps)(Conversations);
