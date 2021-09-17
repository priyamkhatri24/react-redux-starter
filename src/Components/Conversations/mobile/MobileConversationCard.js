import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Media from 'react-bootstrap/Media';
import Container from 'react-bootstrap/Container';
import Message from '../Message/Message';
import '../Conversation.scss';

const MobileConversationCard = function ({ name, subTitle, thumbnail, unreadCount, onClick }) {
  return (
    <Row noGutters>
      <Col xs={12}>
        <div className='mt-1 mb-1'>
          <Media as='li' className='conversation-container p-2' onClick={onClick}>
            <Image
              src={thumbnail}
              width={40}
              height={40}
              className='align-self-center mr-3'
              roundedCircle
            />
            <Media.Body>
              <Container fluid>
                <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Col xs={10}>
                    <b>{name}</b>
                    {subTitle?.text ? (
                      <p className='smallOnDesktop card-subtitle'>
                        {subTitle.text.slice(0, 33)}
                        {subTitle.text.length > 33 ? '...' : null}
                      </p>
                    ) : null}
                  </Col>
                  {unreadCount > 0 && (
                    <div className='my-auto'>
                      <span
                        className='text-center'
                        style={{
                          fontSize: '11px',
                          backgroundColor: 'green',
                          color: '#fff',
                          borderRadius: '50%',
                          padding: '4px 7px',
                          marginRight: '10px',
                          width: '16px',
                          height: 'auto',
                        }}
                      >
                        {unreadCount}
                      </span>
                    </div>
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
