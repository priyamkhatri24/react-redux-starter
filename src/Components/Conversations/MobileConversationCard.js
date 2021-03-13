import React from 'react';
import { Container, Row, Col, ListGroup, Card } from 'react-bootstrap';

const MobileConversationCard = function () {
  return (
    <Container fluid className='pt-3 pb-3'>
      <h5 className='pb-2'>Chats</h5>

      <Row className='conversations-container overflow-auto'>
        <Col xs={0} md={12}>
          <Card className='mt-2 p-2'>Cras justo odio</Card>
          <Card className='mt-2 p-2'>Cras justo odio</Card>
          {/* <ListGroup>
            <ListGroup.Item>Cras justo odio</ListGroup.Item>
            <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
            <ListGroup.Item>Morbi leo risus</ListGroup.Item>
            <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
            <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
          </ListGroup> */}
        </Col>
      </Row>
    </Container>
  );
};

export default MobileConversationCard;
