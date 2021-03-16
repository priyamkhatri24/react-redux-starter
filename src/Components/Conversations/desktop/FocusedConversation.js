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

const FocusedConversation = function () {
  return (
    <Container className='d-flex flex-column justify-content-between conversations-container p-3'>
      <Row>
        <Col>
          <h3>Focused Conversation</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={1}>
          <DropdownButton
            as={ButtonGroup}
            key='up'
            id='dropdown-button-drop-up'
            drop='up'
            variant='primary'
            title={<i className='material-icons'>attachment</i>}
          >
            <Dropdown.Item eventKey='1'>Action</Dropdown.Item>
            <Dropdown.Item eventKey='2'>Another action</Dropdown.Item>
            <Dropdown.Item eventKey='3'>Something else here</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey='4'>Separated link</Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col xs={10}>
          <FormControl as='textarea' aria-label='With textarea' />
        </Col>
        <Col xs={1}>
          <Button>
            <i className='material-icons'>send</i>
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default FocusedConversation;
