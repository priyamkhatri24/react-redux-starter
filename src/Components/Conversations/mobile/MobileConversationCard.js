import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Media from 'react-bootstrap/Media';
import Container from 'react-bootstrap/Container';
import Message from '../Message/Message';

const MobileConversationCard = function ({ name, subTitle, thumbnail, unreadCount, onClick }) {
  return (
    <Row noGutters>
      <Col xs={12}>
        <div className='mt-1 mb-1'>
          <Media as='li' className='conversation-container p-2' onClick={onClick}>
            <Image src={thumbnail} width={40} className='align-self-center mr-3' roundedCircle />
            <Media.Body>
              <Container fluid>
                <Row>
                  <Col xs={10}>
                    <b>{name}</b>
                    <p className='card-subtitle'>{subTitle.text}</p>
                  </Col>
                  {unreadCount > 0 && (
                    <Col xs={2} className='my-auto'>
                      <span
                        className='text-center'
                        style={{
                          fontSize: '11px',
                          backgroundColor: 'green',
                          color: '#fff',
                          borderRadius: '50%',
                          padding: '3px 6px',
                        }}
                      >
                        {unreadCount}
                      </span>
                    </Col>
                  )}
                </Row>
              </Container>
            </Media.Body>
          </Media>
        </div>
      </Col>
    </Row>
  );
};

MobileConversationCard.propTypes = {
  name: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  subTitle: PropTypes.objectOf(Message).isRequired,
  unreadCount: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};

MobileConversationCard.defaultProps = {
  onClick: () => {},
};

export default MobileConversationCard;
