import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Card, Image, Media, Badge } from 'react-bootstrap';

const MobileConversationCard = function ({ name, subTitle }) {
  return (
    <Container fluid className='mt-1 mb-1'>
      <Row noGutters>
        <Col xs={12}>
          <Media as='li' className='conversation-container p-2'>
            <Image
              src='https://i.pravatar.cc/40'
              width={40}
              className='align-self-center mr-3'
              roundedCircle
            />
            <Media.Body>
              <Row>
                <Col xs={10}>
                  <b>{name}</b>
                  <p className='card-subtitle'>{subTitle}</p>
                </Col>
                <Col xs={2} className='my-auto'>
                  <Badge variant='success'>2</Badge>
                </Col>
              </Row>
            </Media.Body>
          </Media>
        </Col>
      </Row>
    </Container>
  );
};

MobileConversationCard.propTypes = {
  name: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
};

export default MobileConversationCard;
