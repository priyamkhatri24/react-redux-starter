import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Media from 'react-bootstrap/Media';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Search from '@material-ui/icons/Search';
import MoreVert from '@material-ui/icons/MoreVert';

const ConversationHeader = function ({
  thumbnail,
  name,
  participantsCount = 0,
  activeTab,
  onTabSelected,
  onClick = null,
}) {
  const history = useHistory();

  return (
    <div style={{ boxShadow: '0px 2px 2px 0px #00000029' }}>
      <Row noGutters>
        <Col xs={12}>
          <div className='p-2 d-flex align-items-center justify-content-between'>
            <div className='d-flex align-items-center'>
              <ArrowBack
                className='mr-3'
                role='button'
                tabIndex={0}
                onClick={() => history.push('/conversations')}
                onKeyDown={() => history.push('/conversations')}
              />
              <div className='heading pt-2 d-flex align-items-center'>
                <Media
                  as='div'
                  className='p-2'
                  onClick={onClick ? () => onClick() : () => history.push('/conversation')}
                >
                  <Image
                    src={thumbnail}
                    width={40}
                    height={40}
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
              {/* <Search className='mr-1' /> */}
              <MoreVert className=' ml-1' />
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
  onClick: PropTypes.func,
};

ConversationHeader.defaultProps = {
  participantsCount: 1,
  onClick: null,
};

export default ConversationHeader;
