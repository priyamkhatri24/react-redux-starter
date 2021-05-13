/** @jsxImportSource @emotion/react */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { connect } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import DurationPicker from 'react-duration-picker';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import Modal from 'react-bootstrap/Modal';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CheckIcon from '@material-ui/icons/Check';
import LiveClassesStyle from './LiveClasses.style';

import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import { getUserProfile } from '../../redux/reducers/userProfile.reducer';
import { get, post, apiValidation } from '../../Utilities';
import { PageHeader, BatchesSelector } from '../Common';
import Jitsi from './Jitsi';
import { createBigBlueButtonStream, rejoinBigBlueButtonStream } from './bbb';

class LiveClasses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batches: [],
      adminBatches: [],
      studentBatches: [],
      selectedBatches: [],
      existingStream: [],
      duration: {},
      showModal: false,
      inputValue: '',
      domain: 'tcalive.ingenimedu.com',
      triggerJitsi: false,
      jitsiRoomName: '',
      jitsiFirstName: props.userProfile.firstName,
      jitsiLastName: props.userProfile.lastName,
      role: 'teacher',
      doesLiveStreamExist: false,
      doesBBBexist: false,
      recordings: [],
      showZoomModal: false,
      zoomMeeting: '',
      zoomPassCode: '',
      showDurationModal: false,
      durationValue: '',
      zoomPasscodeModal: false,
      copiedToClipboard: false,
    };
  }

  componentDidMount() {
    const { clientUserId, roleArray, clientId } = this.props;

    if (roleArray.includes(1) || roleArray.includes(2)) {
      this.setState({ role: 'student' });
      const payload = {
        client_user_id: clientUserId,
      };
      get(payload, '/getLiveStreamsForStudent').then((res) => {
        const result = apiValidation(res);
        const tempfilter = result.filter((e) => e.stream_type !== 'zoom');
        this.setState({ studentBatches: result });
        // this.setState({ studentBatches: tempfilter });
      });
    }

    if (roleArray.includes(3) || roleArray.includes(4)) {
      const payload = {
        client_user_id: clientUserId,
      };

      get(payload, '/getLiveStreamsForTeacher').then((res) => {
        const result = apiValidation(res);

        if (result.length) this.setState({ existingStream: result, doesLiveStreamExist: true });
      });

      get(payload, '/getBatchesOfTeacher')
        .then((res) => {
          const result = apiValidation(res);
          this.setState({ batches: result });
        })
        .catch((e) => console.log(e));
    }

    if (roleArray.includes(4)) {
      const payload = {
        client_user_id: clientUserId,
        client_id: clientId,
      };

      get(payload, '/getLiveStreamsForAdmin').then((res) => {
        const result = apiValidation(res);
        console.log(result);
        this.setState({ adminBatches: result });
      });
    }

    /** **********************Recordings ********** */

    get(
      { client_user_id: clientUserId, client_id: clientId },
      '/getRecordedLiveStreamOfCoaching',
    ).then((res) => {
      const result = apiValidation(res);
      console.log(result);
      this.setState({ recordings: result });
      const { recordings } = this.state;
      console.log(recordings);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { triggerJitsi, doesBBBexist } = this.state;
    const { clientUserId } = this.props;
    if (prevState.triggerJitsi !== triggerJitsi || doesBBBexist) {
      const payload = {
        client_user_id: clientUserId,
      };

      get(payload, '/getLiveStreamsForTeacher').then((res) => {
        const result = apiValidation(res);

        if (result.length)
          this.setState({ existingStream: result, doesLiveStreamExist: true, doesBBBexist: false });
      });
    }
  }

  startLiveStream = (element) => {
    const { domain, jitsiFirstName, jitsiLastName, role } = this.state;

    if (element.stream_type === 'jitsi') {
      let strippedDomain = domain;
      if (element.server_url) strippedDomain = element.server_url.split('/')[2]; // eslint-disable-line
      this.setState({
        jitsiFirstName: element.first_name,
        jitsiLastName: element.last_name,
        jitsiRoomName: element.stream_link,
        domain: strippedDomain,
        triggerJitsi: true,
      });
    } else if (element.stream_type === 'big_blue_button') {
      rejoinBigBlueButtonStream(
        jitsiFirstName,
        jitsiLastName,
        element.stream_id,
        element.client_user_client_user_id,
        role,
      );
      this.setState({ doesBBBexist: true });
    } else if (element.stream_type === 'zoom') {
      console.log(element);
      this.setState({ zoomPassCode: element.password, zoomMeeting: element.meeting_id }, () => {
        this.openZoomPasscodeModal();
      });
      //  window.open(`https://zoom.us/j/${element.meeting_id}?pwd=${element.password}`);
    } else console.error('invalid stream type');
  };

  rejoinLiveStream = (element) => {
    const { domain, jitsiFirstName, jitsiLastName } = this.state;

    if (element.stream_type === 'jitsi') {
      let strippedDomain = domain;
      if (element.server_url) strippedDomain = element.server_url.split('/')[2]; //eslint-disable-line
      this.setState({
        jitsiRoomName: element.stream_link,
        domain: strippedDomain,
        triggerJitsi: true,
      });
    } else if (element.stream_type === 'big_blue_button') {
      rejoinBigBlueButtonStream(
        jitsiFirstName,
        jitsiLastName,
        element.stream_id,
        element.client_user_client_user_id,
      );
      this.setState({ doesBBBexist: true });
    } else if (element.stream_type === 'zoom') {
      window.open(`https://zoom.us/j/${element.meeting_id}?pwd=${element.password}`);
    } else console.error('invalid stream type');
  };

  deleteLiveStream = (element) => {
    const payload = {
      stream_id: element.stream_id,
      stream_type: element.stream_type,
    };

    post(payload, '/deleteLiveStream')
      .then((res) => {
        const result = apiValidation(res);
        if (result) this.setState({ existingStream: [], doesLiveStreamExist: false });
      })
      .catch((e) => console.error(e));
  };

  handleClose = () => this.setState({ showModal: false });

  getSelectedBatches = (payload) => {
    const { selectedBatches } = this.state;
    this.setState({ selectedBatches: payload });
    const extraBatchesString = payload.length > 1 ? ` +${(payload.length - 2).toString()}` : '';
    if (payload.length) {
      const inputString = payload.reduce((acc, elem, index) => {
        if (index < 1) {
          return `${acc + elem.batch_name},`;
        }
        if (index === 1) {
          return acc + elem.batch_name;
        }
        return acc;
      }, '');
      if (selectedBatches.length > 0)
        this.setState({ inputValue: inputString + extraBatchesString });
      else this.setState({ inputValue: '' });
    }
  };

  createJitsiStream = (batches = [], duration, clientId, clientUserId) => {
    const streamLink = `${Date.now()}${clientId}${clientUserId}`;

    const payload = {
      stream_link: streamLink,
      duration,
      client_user_id: clientUserId,
      batch_array: batches,
      client_id: clientId,
    };

    post(payload, '/addLiveStream')
      .then((res) => {
        const result = apiValidation(res);
        const jitsiDomain = result.server_url.split('/')[2];

        this.setState({ domain: jitsiDomain, jitsiRoomName: streamLink, triggerJitsi: true });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  createStream = (id) => {
    console.log(id);
    const { duration, selectedBatches, jitsiFirstName, jitsiLastName } = this.state;
    const { clientUserId, clientId } = this.props;
    // const durationArray = duration.split(':');
    const durationArray = [];
    durationArray.push(duration.hours, duration.minutes, duration.seconds);
    console.log(durationArray);
    const milliseconds =
      (durationArray[0] * 3600 + durationArray[1] * 60 + durationArray[2]) * 1000;
    if (Number.isNaN(Number(milliseconds))) {
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: 'Please input the complete duration.',
      });

      return;
    }
    const batchIdArray = JSON.stringify(selectedBatches.map((elem) => elem.client_batch_id));
    if (id === 'alpha')
      this.createJitsiStream(batchIdArray, milliseconds.toString(), clientId, clientUserId);
    else if (id === 'beta') {
      createBigBlueButtonStream(
        batchIdArray,
        milliseconds.toString(),
        clientUserId,
        clientId,
        jitsiFirstName,
        jitsiLastName,
      );
      this.setState({ doesBBBexist: true });
    }
  };

  jitsiDisplayHide = () => this.setState({ triggerJitsi: false });

  // setBigBlueButtonStream = () => {
  //   const { duration, jitsiFirstName, jitsiLastName } = this.state;
  //   const { clientUserId, clientId } = this.props;
  // };

  closeZoomPasscodeModal = () => this.setState({ zoomPasscodeModal: false });

  openZoomPasscodeModal = () => this.setState({ zoomPasscodeModal: true });

  createZoomMeeting = () => {
    const { zoomMeeting, zoomPassCode, selectedBatches } = this.state;
    const { clientUserId } = this.props;
    const batchIdArray = JSON.stringify(selectedBatches.map((elem) => elem.client_batch_id));

    const payload = {
      meeting_id: zoomMeeting,
      client_user_id: clientUserId,
      password: zoomPassCode,
      batch_array: batchIdArray,
    };

    post(payload, '/addZoomMeeting').then((res) => {
      console.log(res);
      if (res.success) {
        this.closeZoomModal();
        Swal.fire({
          title: 'Success',
          text: 'Meeting Created Successfully',
          icon: 'success',
          confirmButtonText: `Go To Meeting?`,
          showCloseButton: true,
          showCancelButton: true,
          cancelButtonText: `No`,
          customClass: 'Assignments__SweetAlert',
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(`https://zoom.us/j/${zoomMeeting}?pwd=${zoomPassCode}`);
          }
        });
      }
    });
  };

  onDurationChange = (duration) => {
    console.log(duration);
    this.setState({ duration });
  };

  closeDurationModal = () => {
    const { duration } = this.state;
    this.setState({ showDurationModal: false });
    const durationString = `${duration.hours < 10 ? `0${duration.hours}` : duration.hours}:${
      duration.minutes < 10 ? `0${duration.minutes}` : duration.minutes
    }:${duration.seconds < 10 ? `0${duration.seconds}` : duration.seconds}`;
    this.setState({ durationValue: durationString });
  };

  closeZoomPasscodeModal = () => this.setState({ zoomPasscodeModal: false });

  openZoomPasscodeModal = () => this.setState({ zoomPasscodeModal: true });

  copyToClipboard = () => {
    const { zoomPassCode } = this.state;
    navigator.clipboard.writeText(zoomPassCode);
    this.setState({ copiedToClipboard: true });
  };

  render() {
    const {
      adminBatches,
      batches,
      inputValue,
      showModal,
      triggerJitsi,
      domain,
      jitsiFirstName,
      jitsiLastName,
      jitsiRoomName,
      role,
      selectedBatches,
      duration,
      doesLiveStreamExist,
      existingStream,
      studentBatches,
      recordings,
      showZoomModal,
      zoomMeeting,
      zoomPassCode,
      showDurationModal,
      durationValue,
      zoomPasscodeModal,
      copiedToClipboard,
    } = this.state;
    return (
      <div css={LiveClassesStyle.liveClasses}>
        <PageHeader title='Live Stream' />

        {triggerJitsi && (
          <Jitsi
            domain={domain}
            jitsiDisplayHide={this.jitsiDisplayHide}
            firstName={jitsiFirstName}
            lastName={jitsiLastName}
            roomName={jitsiRoomName}
            role={role}
          />
        )}
        <Tabs
          style={{ marginTop: '4rem' }}
          defaultActiveKey='Live Classes'
          className='Profile__Tabs'
          justify
        >
          <Tab eventKey='Live Classes' title='Live Classes'>
            {!triggerJitsi && role === 'student' && (
              <div className='mt-4'>
                {studentBatches.length ? (
                  studentBatches.map((elem) => {
                    return (
                      <Card
                        key={elem.stream_id}
                        css={LiveClassesStyle.card}
                        className='mx-auto p-2 mb-3 mb-lg-5'
                      >
                        <div css={LiveClassesStyle.adminCard} className='p-2'>
                          <h6 css={LiveClassesStyle.adminHeading} className='mb-0'>
                            {elem.first_name} {elem.last_name} is streaming Live
                          </h6>
                          <p css={LiveClassesStyle.adminCardTime} className='mb-0'>
                            {format(fromUnixTime(elem.created_at), 'HH:mm MMM dd, yyyy')}
                          </p>

                          <p css={LiveClassesStyle.adminDuration}>
                            Duration:{' '}
                            <span css={LiveClassesStyle.adminDurationSpan}>
                              {`${Math.floor(elem.duration / 3600000)} hr ${Math.floor(
                                (elem.duration % 3600) / 60,
                              )} min `}
                            </span>
                          </p>

                          <p css={LiveClassesStyle.adminBatches}>
                            Streaming In :{' '}
                            {elem.batch_array.map((e, i) => {
                              return (
                                <span css={LiveClassesStyle.adminBatchesSpan} key={`elem${e}`}>
                                  {e}
                                  {i < elem.batch_array.length - 1 ? ',' : ''}
                                </span>
                              );
                            })}
                          </p>
                          <Row className='justify-content-center mb-2 mb-lg-4'>
                            <Button
                              variant='customPrimary'
                              size='sm'
                              onClick={() => this.startLiveStream(elem)}
                            >
                              Attend Live Now!
                            </Button>
                          </Row>
                        </div>
                      </Card>
                    );
                  })
                ) : (
                  <p className='text-center m-4'>
                    Oops! There are no videos being streamed currently.
                  </p>
                )}
                <Modal show={zoomPasscodeModal} onHide={this.closeZoomPasscodeModal} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Copy PassCode</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Row>
                      <Col xs={7} className='text-center' css={LiveClassesStyle.passcode}>
                        {zoomPassCode}
                      </Col>
                      <Col
                        cs={5}
                        className='text-center my-auto'
                        onClick={() => this.copyToClipboard()}
                      >
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
                    <Button variant='boldTextSecondary' onClick={this.closeZoomPasscodeModal}>
                      Cancel
                    </Button>
                    <Button
                      variant='boldText'
                      onClick={() =>
                        window.open(`https://zoom.us/j/${zoomMeeting}?pwd=${zoomPassCode}`)
                      } //eslint-disable-line
                    >
                      Attend Meeting Now!
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            )}

            {!triggerJitsi && role === 'teacher' && (
              <>
                {doesLiveStreamExist &&
                  existingStream.map((elem) => {
                    return (
                      <div
                        css={LiveClassesStyle.adminCard}
                        className='p-2 m-3'
                        key={`elem${elem.stream_id}`}
                      >
                        <h6 css={LiveClassesStyle.adminHeading} className='mb-0'>
                          Ongoing Live Stream
                        </h6>
                        <p css={LiveClassesStyle.adminCardTime} className='mb-0'>
                          {format(fromUnixTime(elem.created_at), 'HH:mm MMM dd, yyyy')}
                        </p>

                        <p css={LiveClassesStyle.adminDuration}>
                          Duration:{' '}
                          <span css={LiveClassesStyle.adminDurationSpan}>
                            {`${Math.floor(elem.duration / 3600000)} hr ${Math.floor(
                              (elem.duration % 3600) / 60,
                            )} min `}
                          </span>
                        </p>

                        <p css={LiveClassesStyle.adminBatches}>
                          Streaming In :{' '}
                          {elem.batch_array.map((e, i) => {
                            return (
                              <span css={LiveClassesStyle.adminBatchesSpan} key={`elem${e}`}>
                                {e}
                                {i < elem.batch_array.length - 1 ? ',' : ''}
                              </span>
                            );
                          })}
                        </p>
                        <Row className='justify-content-center mb-2 mb-lg-4'>
                          <Col xs={9} className='text-center'>
                            <Button
                              variant='customPrimary'
                              size='sm'
                              onClick={() => this.rejoinLiveStream(elem)}
                            >
                              Rejoin
                            </Button>
                          </Col>
                          <Col>
                            <DeleteIcon onClick={() => this.deleteLiveStream(elem)} />
                          </Col>
                        </Row>
                      </div>
                    );
                  })}

                {!doesLiveStreamExist && (
                  <>
                    <Card css={LiveClassesStyle.card} className='mx-auto mt-5 p-3'>
                      <label htmlFor='Select Batch' className='has-float-label my-auto'>
                        <input
                          className='form-control'
                          name='Select Batch'
                          type='text'
                          placeholder='Select Batch'
                          onClick={() => this.setState({ showModal: true })}
                          readOnly
                          value={inputValue}
                        />
                        <span>Select Batch</span>
                        <i
                          css={LiveClassesStyle.show}
                          onClick={() => this.setState({ showModal: true })}
                          onKeyDown={() => this.setState({ showModal: true })}
                          role='button'
                          tabIndex='-1'
                        >
                          <ExpandMoreIcon />
                        </i>
                      </label>
                      <label className='has-float-label my-auto' htmlFor='Duration'>
                        <input
                          className='form-control mt-4'
                          name='Duration'
                          type='text'
                          placeholder='Duration'
                          readOnly
                          value={durationValue}
                          onClick={() => this.setState({ showDurationModal: true })}
                        />
                        <span className='mt-4'>Duration</span>
                      </label>
                    </Card>
                    <Row className='justify-content-center mt-4 mt-lg-5 mx-2'>
                      <Col className='text-center p-0'>
                        <Button
                          variant='customPrimarySmol'
                          size='sm'
                          onClick={(e) => this.createStream(e.target.id)}
                          disabled={!selectedBatches.length || !duration}
                          id='alpha'
                        >
                          Go Live Alpha!
                        </Button>
                      </Col>
                      <Col className='text-center p-0'>
                        <Button
                          variant='customPrimarySmol'
                          size='sm'
                          onClick={(e) => this.createStream(e.target.id)}
                          disabled={!selectedBatches.length || !duration}
                          id='beta'
                        >
                          Go Live Beta!
                        </Button>
                      </Col>
                      <Col className='text-center p-0'>
                        <Button
                          variant='customPrimarySmol'
                          size='sm'
                          onClick={(e) => this.openZoomModal()}
                          disabled={!selectedBatches.length || !duration}
                          id='beta'
                        >
                          Go Live Zoom!
                        </Button>
                      </Col>
                    </Row>
                  </>
                )}
                {adminBatches.length && (
                  <div css={LiveClassesStyle.adminInfo}>
                    <h6 css={LiveClassesStyle.adminHeading} className='text-center my-4 my-md-5 '>
                      Institute&apos;s other Live Classes
                    </h6>

                    {adminBatches.map((elem) => {
                      return (
                        <Card
                          key={elem.stream_id}
                          css={LiveClassesStyle.card}
                          className=' mx-auto p-2 mb-3 mb-lg-5'
                        >
                          <div css={LiveClassesStyle.adminCard} className='p-2'>
                            <h6 css={LiveClassesStyle.adminHeading} className='mb-0'>
                              {elem.first_name} {elem.last_name} is streaming Live
                            </h6>
                            <p css={LiveClassesStyle.adminCardTime} className='mb-0'>
                              {format(fromUnixTime(elem.created_at), 'HH:mm MMM dd, yyyy')}
                            </p>

                            <p css={LiveClassesStyle.adminDuration}>
                              Duration:{' '}
                              <span css={LiveClassesStyle.adminDurationSpan}>
                                {`${Math.floor(elem.duration / 3600000)} hr ${Math.floor(
                                  (elem.duration % 3600) / 60,
                                )} min `}
                              </span>
                            </p>

                            <p css={LiveClassesStyle.adminBatches}>
                              Streaming In :{' '}
                              {elem.batch_array.map((e, i) => {
                                return (
                                  <span css={LiveClassesStyle.adminBatchesSpan} key={`elem${e}`}>
                                    {e}
                                    {i < elem.batch_array.length - 1 ? ',' : ''}
                                  </span>
                                );
                              })}
                            </p>
                            <Row className='justify-content-center mb-2 mb-lg-4'>
                              <Button
                                variant='customPrimary'
                                size='sm'
                                onClick={() => this.startLiveStream(elem)}
                              >
                                Attend Live Now!
                              </Button>
                            </Row>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}

                <Modal show={showModal} onHide={this.handleClose} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Select Batches</Modal.Title>
                  </Modal.Header>
                  <BatchesSelector
                    batches={batches}
                    selectBatches={selectedBatches}
                    getSelectedBatches={this.getSelectedBatches}
                    title='Batches'
                  />
                  <Modal.Footer>
                    <Button variant='dashboardBlueOnWhite' onClick={this.handleClose}>
                      Next
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal show={showZoomModal} centered onHide={this.closeZoomModal}>
                  <Modal.Header closeButton>
                    <span
                      className='Scrollable__courseCardHeading my-auto'
                      style={{ fontSize: '14px' }}
                    >
                      Meeting Details
                    </span>
                  </Modal.Header>
                  <Modal.Body>
                    <Row className='mx-2'>
                      <label className='has-float-label my-auto w-100'>
                        <input
                          className='form-control'
                          name='Meeting ID'
                          type='text'
                          placeholder='Meeting ID'
                          onChange={(e) => this.setState({ zoomMeeting: e.target.value })}
                          value={zoomMeeting}
                        />
                        <span>Meeting ID</span>
                      </label>
                    </Row>
                    <Row className='mx-2 mt-2'>
                      <label className='has-float-label my-auto w-100'>
                        <input
                          className='form-control'
                          name='Enter Passcode'
                          type='text'
                          placeholder='Enter Passcode'
                          onChange={(e) => this.setState({ zoomPassCode: e.target.value })}
                          value={zoomPassCode}
                        />
                        <span>Enter Passcode</span>
                      </label>
                    </Row>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant='boldTextSecondary' onClick={() => this.closeZoomModal()}>
                      Cancel
                    </Button>
                    <Button variant='boldText' onClick={() => this.createZoomMeeting()}>
                      Submit
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Modal show={showDurationModal} onHide={this.closeDurationModal} centered>
                  <DurationPicker
                    onChange={this.onDurationChange}
                    initialDuration={{ hours: 1, minutes: 2, seconds: 3 }}
                  />
                  <Modal.Footer>
                    <Button variant='dashboardBlueOnWhite' onClick={this.closeDurationModal}>
                      Next
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            )}
          </Tab>
          <Tab eventKey='Recordings' title='Recordings'>
            {recordings.length > 0 ? (
              <div>
                {recordings.map((elem) => {
                  return (
                    <Card
                      key={elem.stream_name}
                      css={LiveClassesStyle.card}
                      className='mx-auto p-2 mb-3 mb-lg-5'
                    >
                      <div css={LiveClassesStyle.adminCard} className='p-2'>
                        <h6 css={LiveClassesStyle.adminHeading} className='mb-0'>
                          {elem.first_name} {elem.last_name} is streaming Live
                        </h6>
                        <p css={LiveClassesStyle.adminCardTime} className='mb-0'>
                          {format(fromUnixTime(elem.created_at), 'HH:mm MMM dd, yyyy')}
                        </p>

                        <p css={LiveClassesStyle.adminDuration}>
                          Duration:{' '}
                          <span css={LiveClassesStyle.adminDurationSpan}>
                            {`${Math.floor(elem.duration / 3600000)} hr ${Math.floor(
                              (elem.duration % 3600) / 60,
                            )} min `}
                          </span>
                        </p>

                        <p css={LiveClassesStyle.adminBatches}>
                          Streaming In :{' '}
                          {elem.batch_array.map((e, i) => {
                            return (
                              <span css={LiveClassesStyle.adminBatchesSpan} key={`elem${e}`}>
                                {e}
                                {i < elem.batch_array.length - 1 ? ',' : ''}
                              </span>
                            );
                          })}
                        </p>
                        <Row className='justify-content-center mb-2 mb-lg-4'>
                          <Button
                            variant='customPrimary'
                            size='sm'
                            onClick={() => this.startLiveStream(elem)}
                          >
                            Watch Recording
                          </Button>
                        </Row>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className='text-center m-4'>Oops! There are no recordings to show.</p>
            )}
          </Tab>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  roleArray: getRoleArray(state),
  clientUserId: getClientUserId(state),
  userProfile: getUserProfile(state),
});

export default connect(mapStateToProps)(LiveClasses);

LiveClasses.propTypes = {
  clientId: PropTypes.number.isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
  clientUserId: PropTypes.number.isRequired,
  userProfile: PropTypes.instanceOf(Object).isRequired,
};
