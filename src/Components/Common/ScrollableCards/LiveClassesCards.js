import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import './ScrollableCards.scss';
import CheckIcon from '@material-ui/icons/Check';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import teacherImg from '../../../assets/images/LiveClasses/teacher.png';
import TimerWatch from '../../Live Classes/TimerWatch';

const getYoutubeIdFromLink = (link) => {
  let viId = '';
  if (link.includes('.be')) {
    viId = link.split('/').pop();
  } else {
    /* eslint-disable */
    viId = link.split('v=')[1];
    const ampersandPosition = viId?.indexOf('&');
    if (ampersandPosition != -1) {
      viId = viId?.substring(0, ampersandPosition);
    }
  }

  return viId;
};

export const LiveClassesCards = (props) => {
  const { liveClasses, history, firstName, lastName } = props;
  const [domain, setDomain] = useState('tcalive.ingenimedu.com');
  const [zoomMeeting, setZoomMeeting] = useState(null);
  const [zoomPassCode, setZoomPassCode] = useState(null);
  const [zoomPassCodeModal, setZoomPassCodeModal] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(zoomPassCode);
    setCopiedToClipboard(true);
  };

  const openJitsiInNewWindow = (serverUrl, roomName, firstname, lastname, token = null) => {
    let joinUrl;

    if (token) {
      joinUrl = `${serverUrl}/${roomName}?jwt=${token}`;
    } else {
      joinUrl = `${serverUrl}/${roomName}#userInfo.displayName="${firstName} ${lastName}"
          &config.remoteVideoMenu.disableKick=true&config.disableDeepLinking=true&config.prejoinPageEnabled=false`;
    }

    window.open(joinUrl, '_blank');
  };

  const rejoinBigBlueButtonStream = (firstname, lastname, streadId, clientUserid, role) => {};

  const openZoomPasscodeModal = () => setZoomPassCodeModal(true);

  const startLiveStream = (element) => {
    if (element.stream_type === 'jitsi') {
      let strippedDomain = domain;
      if (element.server_url) strippedDomain = element.server_url.split('/')[2]; // eslint-disable-line

      openJitsiInNewWindow(element.server_url, element.stream_link, firstName, lastName);
    } else if (element.stream_type === 'big_blue_button') {
      rejoinBigBlueButtonStream(
        firstName,
        lastName,
        element.stream_id,
        element.client_user_client_user_id,
        'student',
      );
    } else if (element.stream_type === 'zoom') {
      console.log(element);
      setZoomMeeting(element.meeting_id);
      setZoomPassCode(element.password);
      openZoomPasscodeModal();

      //  window.open(`https://zoom.us/j/${element.meeting_id}?pwd=${element.password}`);
    } else if (element.stream_type === 'meet') {
      window.open(`https://meet.google.com/${element.meeting_id}`, '_blank');
    } else if (element.stream_type === 'youtube') {
      const vidId = getYoutubeIdFromLink(element.meeting_id);
      history.push({ pathname: '/videoplayer', state: { link: vidId } });
    } else console.error('invalid stream type');
  };

  return (
    <>
      {liveClasses.length > 0 && (
        <section
          className='Scrollable__liveClassesCard mt-3'
          style={{ marginLeft: 0, marginRight: 0 }}
        >
          <div className='Scrollable__subHeadTextUnderHeading'>
            <div className='d-flex justify-content-between w-100'>
              <h5 className='Scrollable__coursesInitialHeading mb-1'>Live Classes</h5>
              <button
                className='Scrollable__viewAllButtonForCards mb-0'
                type='button'
                onClick={() => history.push('/liveclasses')}
              >
                View All <ChevronRightIcon />
              </button>
            </div>
            <p className='smallTextUnderHeading'>Attend all your live classes here.</p>
          </div>
          <div
            className='d-flex mx-auto deskDisplayLC'
            style={{ marginTop: '70px', marginBottom: '15px' }}
          >
            {liveClasses.map((elem) => {
              let startTimeText = '';
              let date = '';
              let timeArray = [];
              let time = '';
              let timeLeftInSeconds = '';
              let timeLeft = '';
              let batchesText = '';
              if (liveClasses.length) {
                startTimeText = new Date(+elem.stream_start_time * 1000).toString();
                date = startTimeText.split(' ').slice(1, 3).join(' ');
                timeArray = startTimeText.split(' ')[4].split(':');
                time = '';
                timeLeftInSeconds = +elem.stream_start_time - +elem.current_time;
                timeLeft = new Date(timeLeftInSeconds * 1000).toISOString().substr(11, 8);
                if (timeArray[0] > 12) {
                  time = `${timeArray[0] - 12}:${timeArray[1]} PM`;
                } else {
                  time = `${timeArray[0]}:${timeArray[1]} AM`;
                }
                if (elem.stream_status === 'active') {
                  time = 'LIVE!';
                }
                batchesText = '';
                if (elem.batch_array.length > 1) {
                  batchesText = `with ${elem.batch_array[0]} and ${elem.batch_array.length - 1} ${
                    elem.batch_array.length - 1 > 1 ? 'others' : 'other'
                  }`;
                } else if (elem.batch_array.length === 1) {
                  batchesText = `with ${elem.batch_array[0]}`;
                }
              }
              return (
                /* eslint-disable */
                <div
                  className='course-card col-sm-6 col-md-4 mx-2'
                  style={{ paddingLeft: 0, paddingRight: 0 }}
                  key={`elem+${elem.stream_id}`}
                >
                  <Card key={elem?.stream_id} className='scheduleCardDashboard mb-2'>
                    <div className='scheduleCardLeft'>
                      <p className='scheduleCardHeading'>
                        <span className='redTag'>LIVE</span> Class
                      </p>
                      <p className='scheduleCardText'>
                        by {`${elem?.first_name} ${elem?.last_name}`}
                      </p>
                      <p className='scheduleCardSmallText'>{batchesText}</p>
                      <h5 className='scheduleCardHeading my-3'>{elem?.topic}</h5>
                      {elem?.stream_status === 'pending' && (
                        <p className='scheduleCardText'>
                          starts @ {time} on {date}
                        </p>
                      )}
                      {elem?.stream_status === 'active' && (
                        <>
                          {/* <p
                            style={{ fontFamily: 'Montserrat-Bold' }}
                            className='scheduleCardHeading'
                          >
                            Live Class is in progress...
                          </p> */}
                          <button
                            onClick={() => startLiveStream(elem)}
                            type='button'
                            className='startNowButton'
                          >
                            ATTEND LIVE NOW
                          </button>
                        </>
                      )}
                    </div>
                    <div className='scheduleCardRight'>
                      {timeLeftInSeconds < 86400 && (
                        <TimerWatch
                          isLive={time === 'LIVE!'}
                          startedProp={timeLeftInSeconds < 0}
                          time={timeLeft}
                        />
                      )}
                      {timeLeftInSeconds >= 86400 && (
                        <img className='teacherImage' src={teacherImg} alt='icon' />
                      )}
                      {/* eslint-disable */}
                      {/* <div
                        onClick={() => this.deleteScheduledClass(elem)}
                        className='deleteContainer'
                      >
                        <DeleteIcon style={{ color: '#00000061' }} />
                      </div> */}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>

          <Modal show={zoomPassCodeModal} onHide={() => setZoomPassCodeModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Copy PassCode</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col
                  xs={7}
                  className='text-center'
                  style={{ fontFamily: 'Montserrat-Bold', fontSize: '16px', color: 'gray' }}
                >
                  {zoomPassCode}
                </Col>
                <Col cs={5} className='text-center my-auto' onClick={() => copyToClipboard()}>
                  {copiedToClipboard ? (
                    <span
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        fontSize: '14px',
                        color: 'rgba(58, 255, 0, 0.87)',
                      }}
                    >
                      <CheckIcon />
                      Copied To Clipboard!
                    </span>
                  ) : (
                    <Button variant='dark'>
                      <AssignmentIcon /> Copy
                    </Button>
                  )}
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='boldTextSecondary' onClick={() => setZoomPassCodeModal(false)}>
                Cancel
              </Button>
              <Button
                variant='boldText'
                onClick={() => window.open(`https://zoom.us/j/${zoomMeeting}?pwd=${zoomPassCode}`)} //eslint-disable-line
              >
                Attend Meeting Now!
              </Button>
            </Modal.Footer>
          </Modal>
        </section>
      )}
    </>
  );
};

LiveClassesCards.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  liveClasses: PropTypes.instanceOf(Array).isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

// col-sm-6 col-md-4 col-lg-2
