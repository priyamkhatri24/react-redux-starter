import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Container,
  Row,
  Col,
  FormControl,
  Button,
  DropdownButton,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';
import { get, apiValidation } from '../../Utilities';
import { conversationsActions } from '../../redux/actions/conversations.action';
import { getConversation } from '../../redux/reducers/conversations.reducer';
import ConversationHeader from './ConversationHeader';
import Messages from './Messages/Messages';
import './Conversation.scss';

const ConversationInput = function () {
  return (
    <Row className='fixed-bottom pb-2' style={{ backgroundColor: '#fff', zIndex: 2 }}>
      <Col xs={12}>
        <div className='d-flex flex-row input-container align-items-center'>
          <DropdownButton
            as={ButtonGroup}
            key='up'
            id='dropdown-button-drop-up'
            drop='up'
            variant='primary'
            title={<i className='material-icons'>attachment</i>}
          >
            <Dropdown.Item eventKey='1'>Image</Dropdown.Item>
            <Dropdown.Item eventKey='2'>Video</Dropdown.Item>
            <Dropdown.Item eventKey='3'>Document</Dropdown.Item>
            <Dropdown.Item eventKey='4'>Audio</Dropdown.Item>
          </DropdownButton>
          <FormControl as='text' aria-label='With text' />
          <Button className='rounded-btn'>
            <i className='material-icons'>send</i>
          </Button>
        </div>
      </Col>
    </Row>
  );
};

const Conversation = function ({ conversation, setConversation }) {
  const fetchMessages = function () {
    get(null, `/getChtOfConversation?conversation_id=${conversation.id}`).then((res) => {
      const apiData = apiValidation(res);
      console.log(apiData);
      const { message_array: messageArray, participants_count: participantsCount } = apiData;
      console.log(messageArray);
      setConversation({
        id: conversation.id,
        participantsCount,
        name: conversation.name,
        thumbnail: conversation.thumbnail,
        messages: messageArray.map((data) => ({
          message: {
            type: 'text',
            content: data.text,
          },
          thumbnail: data.sent_by.display_picture || 'https://i.pravatar.cc/40',
          userIsAuthor: data.sent_by.client_user_id === 1,
          timestamp: data.sent_time,
        })),
      });
    });
  };

  useEffect(function () {
    fetchMessages();
  }, []);

  return (
    <>
      <div className='fixed-top' style={{ zIndex: 2, backgroundColor: '#fff' }}>
        <ConversationHeader
          thumbnail={conversation.thumbnail}
          name={conversation.name}
          participantsCount={conversation.participantsCount}
        />
      </div>
      <Row>
        <Col md={12}>
          <Messages list={conversation.messages} />
          <ConversationInput />
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  conversation: getConversation(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setConversation: (conversation) => {
      dispatch(conversationsActions.setConversation(conversation));
    },
  };
};

Conversation.propTypes = {
  setConversation: PropTypes.func.isRequired,
  conversation: PropTypes.objectOf({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    participantsCount: PropTypes.number,
    messages: PropTypes.arrayOf({
      username: PropTypes.string.isRequired,
      message: PropTypes.objectOf({
        type: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
      }),
      thumbnail: PropTypes.string.isRequired,
      userIsAuthor: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
