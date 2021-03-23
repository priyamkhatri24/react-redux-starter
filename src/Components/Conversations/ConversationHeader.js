import React from 'react';
import { Row, Col, Image, Media, Tabs, Tab } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

const ConversationHeader = function ({
  thumbnail,
  name,
  participantsCount = 0,
  activeTab,
  onTabSelected,
}) {
  const history = useHistory();

  return (
    <div style={{ boxShadow: '0px 2px 2px 0px #00000029' }}>
      <Row noGutters>
        <Col xs={12}>
          <div className='p-2 d-flex align-items-center justify-content-between'>
            <div className='d-flex align-items-center'>
              <i
                className='material-icons mr-3'
                role='button'
                tabIndex={0}
                onClick={() => history.push('/conversations')}
                onKeyDown={() => history.push('/conversations')}
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
                  <Media.Body className='align-self-center'>
                    <Row>
                      <Col xs={12}>
                        <p
                          style={{
                            fontSize: '12px',
                            fontFamily: 'Montserrat-Bold',
                            color: '#000',
                            marginBottom: '0px',
                          }}
                        >
                          {name}
                        </p>
                        {participantsCount > 1 && (
                          <p
                            style={{
                              fontSize: '10px',
                              fontFamily: 'Montserrat-Regular',
                              color: '#0000008A',
                              marginBottom: '0px',
                            }}
                          >
                            {participantsCount} participants
                          </p>
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
      <Row>
        <Col>
          <Tabs
            id='controlled-tab-example'
            activeKey={activeTab}
            onSelect={(k) => onTabSelected(k)}
          >
            <Tab eventKey='chats' title='All Chats' />
            <Tab eventKey='discussions' title='Discussions' />
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

ConversationHeader.propTypes = {
  thumbnail: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  participantsCount: PropTypes.number,
  activeTab: PropTypes.string.isRequired,
  onTabSelected: PropTypes.func.isRequired,
};

ConversationHeader.defaultProps = {
  participantsCount: 1,
};

export default ConversationHeader;
