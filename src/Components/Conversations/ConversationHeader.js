import React from 'react';
import { Row, Col, Image, Media } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

const ConversationHeader = function ({ thumbnail, name, participantsCount = 0 }) {
  const history = useHistory();

  return (
    <Row noGutters>
      <Col xs={12}>
        <div
          className='p-2 d-flex align-items-center justify-content-between'
          style={{ boxShadow: '0px 5px 5px 0px rgba(50, 50, 50, 0.2)' }}
        >
          <div className='d-flex align-items-center'>
            <i
              className='material-icons mr-3'
              role='button'
              tabIndex={0}
              onClick={() => history.goBack()}
              onKeyDown={() => history.goBack()}
            >
              arrow_back
            </i>
            <div className='heading pt-2 d-flex align-items-center'>
              <Media as='div' className='p-2' onClick={() => history.push('/conversation')}>
                <Image
                  src={thumbnail}
                  width={40}
                  className='align-self-center mr-3'
                  roundedCircle
                />
                <Media.Body>
                  <Row>
                    <Col xs={12}>
                      <b>{name}</b>
                      {participantsCount > 1 && (
                        <p className='card-subtitle'>{participantsCount} participants</p>
                      )}
                    </Col>
                  </Row>
                </Media.Body>
              </Media>
            </div>
          </div>
          <div className='d-flex justify-self-end align-items-center'>
            <i className='material-icons mr-1'>search</i>
            <i className='material-icons ml-1'>more_vert</i>
          </div>
        </div>
      </Col>
    </Row>
  );
};

ConversationHeader.propTypes = {
  thumbnail: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  participantsCount: PropTypes.number,
};

ConversationHeader.defaultProps = {
  participantsCount: 1,
};

export default ConversationHeader;
