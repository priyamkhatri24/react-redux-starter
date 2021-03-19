import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Image, Media } from 'react-bootstrap';

const MobileConversationCard = function ({ name, subTitle, thumbnail, unreadCount, onClick }) {
  return (
    <Row noGutters>
      <Col xs={12}>
        <div className='mt-1 mb-1'>
          <Media as='li' className='conversation-container p-2' onClick={onClick}>
            <Image src={thumbnail} width={40} className='align-self-center mr-3' roundedCircle />
            <Media.Body>
              <Row>
                <Col xs={10}>
                  <b>{name}</b>
                  <p className='card-subtitle'>{subTitle}</p>
                </Col>
                {unreadCount > 0 && (
                  <Col xs={2} className='my-auto'>
                    <div
                      className='text-center'
                      style={{
                        fontSize: '13px',
                        backgroundColor: 'green',
                        color: '#fff',
                        borderRadius: '50%',
                        padding: '5px',
                      }}
                    >
                      {unreadCount}
                    </div>
                  </Col>
                )}
              </Row>
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
  subTitle: PropTypes.string.isRequired,
  unreadCount: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};

MobileConversationCard.defaultProps = {
  onClick: () => {},
};

export default MobileConversationCard;
