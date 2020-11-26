import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { connect } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
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
import './LiveClasses.scss';

class LiveClasses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batches: [],
      adminBatches: [],
      studentBatches: [],
      selectedBatches: [],
      existingStream: [],
      duration: null,
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

        this.setState({ studentBatches: result });
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
      if (element.server_url) strippedDomain = element.server_url.split('/')[2];
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
    } else console.error('invalid stream type');
  };

  rejoinLiveStream = (element) => {
    const { domain, jitsiFirstName, jitsiLastName } = this.state;

    if (element.stream_type === 'jitsi') {
      let strippedDomain = domain;
      if (element.server_url) strippedDomain = element.server_url.split('/')[2];
      this.setState({
        jitsiRoomName: element.stream_link,
        domain: strippedDomain,
        triggerJitsi: true,
      });
    } else if (element.stream_type === 'big_blue_button') {
      console.log('bbb nhi hua', element);
      rejoinBigBlueButtonStream(
        jitsiFirstName,
        jitsiLastName,
        element.stream_id,
        element.client_user_client_user_id,
      );
      this.setState({ doesBBBexist: true });
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
      this.setState({ inputValue: inputString + extraBatchesString });
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
    const durationArray = duration.split(':');
    const milliseconds =
      (durationArray[0] * 3600 + durationArray[1] * 60 + durationArray[2]) * 1000;
    if (Number.isNaN(Number(milliseconds))) {
      alert('Please input the complete duration.');
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
    } = this.state;
    return (
      <div className='LiveClasses'>
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

        {!triggerJitsi && role === 'student' && (
          <div className='mt-4'>
            {studentBatches.length ? (
              studentBatches.map((elem) => {
                return (
                  <Card key={elem.stream_id} className='LiveClasses__Card mx-auto p-2 mb-3 mb-lg-5'>
                    <div className='LiveClasses__adminCard p-2'>
                      <h6 className='LiveClasses__adminHeading mb-0'>
                        {elem.first_name} {elem.last_name} is streaming Live
                      </h6>
                      <p className='LiveClasses__adminCardTime mb-0'>
                        {format(fromUnixTime(elem.created_at), 'HH:mm MMM dd, yyyy')}
                      </p>

                      <p className='LiveClasses__adminDuration'>
                        Duration:{' '}
                        <span>
                          {`${Math.floor(elem.duration / 3600000)} hr ${Math.floor(
                            (elem.duration % 3600) / 60,
                          )} min `}
                        </span>
                      </p>

                      <p className='LiveClasses__adminBatches'>
                        Streaming In :{' '}
                        {elem.batch_array.map((e, i) => {
                          return (
                            <span key={`elem${e}`}>
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
              <p className='text-center m-4'>Oops! There are no videos being streamed currently.</p>
            )}
          </div>
        )}

        {!triggerJitsi && role === 'teacher' && (
          <>
            {doesLiveStreamExist &&
              existingStream.map((elem) => {
                return (
                  <div className='LiveClasses__adminCard p-2 m-3' key={`elem${elem.stream_id}`}>
                    <h6 className='LiveClasses__adminHeading mb-0'>Ongoing Live Stream</h6>
                    <p className='LiveClasses__adminCardTime mb-0'>
                      {format(fromUnixTime(elem.created_at), 'HH:mm MMM dd, yyyy')}
                    </p>

                    <p className='LiveClasses__adminDuration'>
                      Duration:{' '}
                      <span>
                        {`${Math.floor(elem.duration / 3600000)} hr ${Math.floor(
                          (elem.duration % 3600) / 60,
                        )} min `}
                      </span>
                    </p>

                    <p className='LiveClasses__adminBatches'>
                      Streaming In :{' '}
                      {elem.batch_array.map((e, i) => {
                        return (
                          <span key={`elem${e}`}>
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
                <Card className='LiveClasses__Card mx-auto mt-5 p-3'>
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
                    <i className='LiveClasses__show'>
                      <ExpandMoreIcon />
                    </i>
                  </label>
                  <label className='has-float-label my-auto' htmlFor='Duration'>
                    <input
                      className='form-control mt-4'
                      name='Duration'
                      type='time'
                      step='1'
                      placeholder='Duration'
                      onChange={(e) => this.setState({ duration: e.target.value })}
                    />
                    <span className='mt-4'>Duration</span>
                  </label>
                </Card>
                <Row className='justify-content-center mt-4 mt-lg-5'>
                  <Button
                    variant='customPrimary'
                    size='sm'
                    className='mr-2 mr-lg-5'
                    onClick={(e) => this.createStream(e.target.id)}
                    disabled={!selectedBatches.length || !duration}
                    id='alpha'
                  >
                    Go Live Alpha!
                  </Button>
                  <Button
                    variant='customPrimary'
                    size='sm'
                    onClick={(e) => this.createStream(e.target.id)}
                    disabled={!selectedBatches.length || !duration}
                    id='beta'
                  >
                    Go Live Beta!
                  </Button>
                </Row>
              </>
            )}
            {adminBatches.length && (
              <div className='LiveClasses__adminInfo'>
                <h6 className='text-center my-4 my-md-5 LiveClasses__adminHeading'>
                  Institute&apos;s other Live Classes
                </h6>

                {adminBatches.map((elem) => {
                  return (
                    <Card
                      key={elem.stream_id}
                      className='LiveClasses__Card mx-auto p-2 mb-3 mb-lg-5'
                    >
                      <div className='LiveClasses__adminCard p-2'>
                        <h6 className='LiveClasses__adminHeading mb-0'>
                          {elem.first_name} {elem.last_name} is streaming Live
                        </h6>
                        <p className='LiveClasses__adminCardTime mb-0'>
                          {format(fromUnixTime(elem.created_at), 'HH:mm MMM dd, yyyy')}
                        </p>

                        <p className='LiveClasses__adminDuration'>
                          Duration:{' '}
                          <span>
                            {`${Math.floor(elem.duration / 3600000)} hr ${Math.floor(
                              (elem.duration % 3600) / 60,
                            )} min `}
                          </span>
                        </p>

                        <p className='LiveClasses__adminBatches'>
                          Streaming In :{' '}
                          {elem.batch_array.map((e, i) => {
                            return (
                              <span key={`elem${e}`}>
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
              <BatchesSelector batches={batches} getSelectedBatches={this.getSelectedBatches} />
              <Modal.Footer>
                <Button variant='dashboardBlueOnWhite' onClick={this.handleClose}>
                  Next
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
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
