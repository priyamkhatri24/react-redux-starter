import React from 'react';
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
import Messages from '../Messages/Messages';
import './FocusedConversation.scss';

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

const FocusedConversation = function () {
  return (
    <>
      <Messages />
      <ConversationInput />
    </>
  );
};

export default FocusedConversation;
