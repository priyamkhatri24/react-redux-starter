/** @jsxImportSource @emotion/react */

import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import DurationPicker from 'react-duration-picker';
import DatePicker from 'react-datepicker';
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
import addDays from 'date-fns/addDays';
import CustomDurationPicker from '../Common/DurationPicker/CustomDurationPicker';
import LiveClassesStyle from './LiveClasses.style';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import { getUserProfile } from '../../redux/reducers/userProfile.reducer';
import classes from './LiveClasses.module.css';
import { get, post, apiValidation } from '../../Utilities';
import { PageHeader, BatchesSelector, Readmore } from '../Common';
import Jitsi from './Jitsi';
import { createBigBlueButtonStream, rejoinBigBlueButtonStream } from './bbb';
import { getCurrentDashboardData } from '../../redux/reducers/dashboard.reducer';
import { history } from '../../Routing';
import img from '../../assets/images/Dashboard/student.svg';
import teacherImg from '../../assets/images/LiveClasses/teacher.png';
import TimerWatch from './TimerWatch';
import alphaSvg from '../../assets/images/LiveClasses/alpha.svg';
import betaSvg from '../../assets/images/LiveClasses/beta.svg';
import zoomSvg from '../../assets/images/LiveClasses/zoom.svg';
import meetSvg from '../../assets/images/LiveClasses/meet.svg';
import youtubeSvg from '../../assets/images/LiveClasses/youtube.svg';
import './LiveClasses.scss';

const startTimerFromGivenTime = (time) => {};

const CustomInput = ({ value, onClick }) => (
  <div className='justify-content-center'>
    <label htmlFor='Select Date' className='has-float-label my-auto w-100 margin-8'>
      <input
        className='form-control'
        name='Select Date'
        type='text'
        placeholder='Select Date'
        onClick={onClick}
        readOnly
        id='dateInputLiveClass'
        value={value}
      />
      {/* eslint-disable */}
      <span onClick={() => document.getElementById('dateInputLiveClass')?.click()}>
        Select Date
      </span>
      <i
        onClick={() => document.getElementById('dateInputLiveClass')?.click()}
        className='LiveClasses__show'
      >
        <ExpandMoreIcon />
      </i>
    </label>
  </div>
);

class LiveClasses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTitle: 'Live Stream',
      batches: [],
      adminBatches: [],
      studentBatches: [],
      studentScheduledClasses: [],
      selectedBatches: [],
      existingStream: {},
      duration: {},
      showModal: false,
      inputValue: '',
      domain: 'tcalive.ingenimedu.com',
      triggerJitsi: false,
      jitsiToken: null,
      jitsiRoomName: '',
      jitsiFirstName: props.userProfile.firstName,
      jitsiLastName: props.userProfile.lastName,
      role: 'teacher',
      doesLiveStreamExist: false,
      doesBBBexist: false,
      recordings: [],
      showZoomModal: false,
      youtubeStreamLink: '',
      zoomMeeting: '',
      zoomPassCode: '',
      showDurationModal: false,
      durationValue: '',
      zoomPasscodeModal: false,
      showYoutubeModal: false,
      youtubeModalType: '',
      copiedToClipboard: false,
      showMeetModal: false,
      googleMeeting: '',
      selectedStreamType: '',
      showGoLiveModal: false,
      scheduledDate: '',
      liveClassTopic: '',
      scheduledTime: '',
      scheduledFrequency: 'Do not repeat',
      myScheduled: [],
      allLiveClasses: [],
      liveArray: [],
      toBeLive: [],
      scheduledMeet: {},
      scheduledYTLive: {},
      showAskToDeleteModal: false,
      streamToBeDeleted: {},
      deleteMethod: '',
      zoomMeetingIdInput: true,
      zoomMeetingLink: '',
    };
  }

  componentDidMount() {
    const { clientUserId, roleArray, clientId, dashboardData } = this.props;
    const { jitsiFirstName, jitsiLastName, myScheduled } = this.state;
    if (roleArray.includes(1) || roleArray.includes(2)) {
      this.setState({ role: 'student' });
      const payload = {
        client_user_id: clientUserId,
      };
      get(payload, '/getLiveStreamsForStudent').then((res) => {
        const result = apiValidation(res);
        console.log(result, 'getLiveStreamsForStudent');
        this.setState({ studentBatches: result });
      });
      get(payload, '/getAllScheduledClassesForStudent').then((res) => {
        console.log(res, 'getAllScheduledClassesForStudent');
        const result = apiValidation(res);
        this.setState({ studentScheduledClasses: result });
      });
    }

    if (roleArray.includes(3) || roleArray.includes(4)) {
      const payload = {
        client_user_id: clientUserId,
      };

      get(payload, '/getBatchesOfTeacherLatest')
        .then((res) => {
          const result = apiValidation(res);
          this.setState({ batches: result });
          console.log(result, 'batchesOfTeacherLatest');
        })
        .catch((e) => console.log(e));

      get({ client_user_id: clientUserId }, '/getCurrentLiveStreamsForTeacher').then((res) => {
        console.log(res, 'res');
        const result = apiValidation(res);
        if (result.is_active === 'true') {
          this.setState({
            existingStream: result,
            doesLiveStreamExist: true,
            // zoomMeeting: result.permanent_zoom_meeting_id,
            // zoomPassCode: result.permanent_zoom_password,
          });
        } else {
          // this.setState({
          //   zoomMeeting: result.permanent_zoom_meeting_id,
          //   zoomPassCode: result.permanent_zoom_password,
          // });
        }
      });

      const scheduledLiveStreamPayload = {
        is_admin: roleArray.includes(4),
        client_user_id: clientUserId,
        client_id: clientId,
        first_name: jitsiFirstName,
        last_name: jitsiLastName,
      };

      get(scheduledLiveStreamPayload, '/getAllScheduledClassesForTeacher').then((res) => {
        const result = apiValidation(res);
        console.log(result, 'getAllScheduledClassesForTeacher');
        this.setState({
          myScheduled: result.schedule_array,
          allLiveClasses: result.all_live_classes,
          liveArray: result.live_array,
          toBeLive: result.to_be_live_array,
        });

        console.log(myScheduled);
      });
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
      '/getRecordedLiveStreamOfCoachingLatest', // latest
    ).then((res) => {
      const result = apiValidation(res);
      console.log(result, 'live');
      this.setState({ recordings: result });
      const { recordings } = this.state;
      console.log(recordings);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { triggerJitsi, doesBBBexist, selectedStreamType } = this.state;
    console.log(selectedStreamType);
    const { clientUserId } = this.props;
    if (prevState.triggerJitsi !== triggerJitsi || doesBBBexist) {
      const payload = {
        client_user_id: clientUserId,
      };

      get(payload, '/getCurrentLiveStreamsForTeacher').then((res) => {
        const result = apiValidation(res);
        if (result.is_active === 'true')
          this.setState({ existingStream: result, doesLiveStreamExist: true, doesBBBexist: false });
      });
    }
  }

  playRecording = (e) => {
    history.push({ pathname: `/videoplayer`, state: { videoLink: e } });
  };

  rerenderArrays = () => {
    const { jitsiFirstName, jitsiLastName } = this.state;
    const { clientId, clientUserId, roleArray } = this.props;
    const scheduledLiveStreamPayload = {
      is_admin: roleArray.includes(4),
      client_user_id: clientUserId,
      client_id: clientId,
      first_name: jitsiFirstName,
      last_name: jitsiLastName,
    };
    get(scheduledLiveStreamPayload, '/getAllScheduledClassesForTeacher').then((resp) => {
      const result = apiValidation(resp);
      console.log(result, 'getAllScheduledClassesForTeacherAfterScheduling');
      this.setState({
        myScheduled: result.schedule_array,
        allLiveClasses: result.all_live_classes,
        liveArray: result.live_array,
        toBeLive: result.to_be_live_array,
      });
    });
  };

  handleDelete = (e) => {
    const payload = {
      stream_name: e.stream_name,
      status: 'deleted',
      created_at: e.created_at,
      client_user_id: e.client_user_id,
    };
    console.log(payload, 'payload');
    console.log(e);
    post(payload, '/changeLiveRecordingFileStatus').then((res) => {
      console.log(res);
      if (res.success) {
        history.push('/liveclasses');
      }
    });
  };

  startLiveStream = (element) => {
    const { domain, jitsiFirstName, jitsiLastName, role } = this.state;
    const {
      userProfile,
      dashboardData: {
        alpha: { method },
      },
    } = this.props;
    console.log(method, 'method');

    if (element.stream_type === 'jitsi') {
      let strippedDomain = domain;
      if (element.server_url) strippedDomain = element.server_url.split('/')[2]; // eslint-disable-line
      this.setState({
        jitsiFirstName: userProfile.firstName,
        jitsiLastName: userProfile.lastName,
        jitsiRoomName: element.stream_link,
        domain: strippedDomain,
        triggerJitsi: false, // method === 'sdk
      });

      this.openJitsiInNewWindow(
        element.server_url,
        element.stream_link,
        userProfile.firstName,
        userProfile.lastName,
      );
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
      // this.openZoomPasscodeModal();

      //  window.open(`https://zoom.us/j/${element.meeting_id}?pwd=${element.password}`);
    } else if (element.stream_type === 'meet') {
      window.open(`https://meet.google.com/${element.google_meet_id}`, '_blank');
    } else if (element.stream_type === 'youtube') {
      let vidId = element.meeting_id.split('v=')[1];
      const ampersandPosition = vidId?.indexOf('&');
      if (ampersandPosition != -1) {
        vidId = vidId?.substring(0, ampersandPosition);
      }
      history.push({ pathname: '/videoplayer', state: { link: vidId } });
    } else console.error('invalid stream type');
  };

  rejoinLiveStream = (element) => {
    const { domain, jitsiFirstName, jitsiLastName } = this.state;
    const {
      dashboardData: {
        alpha: { method },
      },
    } = this.props;

    console.log(element);
    if (element.stream_type === 'jitsi') {
      let strippedDomain = domain;
      if (element.server_url) strippedDomain = element.server_url.split('/')[2]; //eslint-disable-line
      this.setState({
        jitsiRoomName: element.stream_link,
        domain: strippedDomain,
        jitsiToken: element.moderator_password,
        triggerJitsi: false,
      });

      this.openJitsiInNewWindow(
        element.server_url,
        element.stream_link,
        jitsiFirstName,
        jitsiLastName,
        element.moderator_password,
      );
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
    } else if (element.stream_type === 'meet') {
      window.open(`https://meet.google.com/${element.meeting_id}`, '_blank');
    } else if (element.stream_type === 'youtube') {
      let vidId = element.meeting_id.split('v=')[1];
      const ampersandPosition = vidId?.indexOf('&');
      if (ampersandPosition != -1) {
        vidId = vidId?.substring(0, ampersandPosition);
      }
      history.push({ pathname: '/videoplayer', state: { link: vidId } });
      console.log(element);
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
        if (result) this.setState({ existingStream: {}, doesLiveStreamExist: false });
      })
      .catch((e) => console.error(e));
  };

  handleClose = () => this.setState({ showModal: false, showGoLiveModal: true });

  handleCloseGoLive = () =>
    this.setState({
      showGoLiveModal: false,
      selectedBatches: [],
      scheduledDate: '',
      liveClassTopic: '',
      scheduledTime: '',
      scheduledFrequency: 'Do not repeat',
    });

  getSelectedBatches = (payload) => {
    console.log(payload);
    const { selectedBatches } = this.state;

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

      this.setState({ selectedBatches: payload }, () => {
        if (payload.length > 0) this.setState({ inputValue: inputString + extraBatchesString });
        else this.setState({ inputValue: '' });
      });
    }
  };

  openJitsiInNewWindow = (serverUrl, roomName, firstName, lastName, token = null) => {
    let joinUrl;

    if (token) {
      joinUrl = `${serverUrl}/${roomName}?jwt=${token}`;
    } else {
      joinUrl = `${serverUrl}/${roomName}#userInfo.displayName="${firstName} ${lastName}"
      &config.remoteVideoMenu.disableKick=true&config.disableDeepLinking=true&config.prejoinPageEnabled=false`;
    }

    window.open(joinUrl, '_blank');
  };

  createJitsiStream = (batches = [], duration, clientId, clientUserId) => {
    const { jitsiFirstName, jitsiLastName } = this.state;
    const {
      userProfile,
      roleArray,
      dashboardData: {
        alpha: { method },
      },
    } = this.props;
    const streamLink = `${Date.now()}${clientId}${clientUserId}`;
    const payload = {
      stream_link: streamLink,
      duration,
      client_user_id: clientUserId,
      batch_array: batches,
      client_id: clientId,
      name: `${userProfile.firstName} ${userProfile.lastName}`,
      contact: `${userProfile.contact}`,
    };
    // addLiveStreamLatest
    post(payload, '/addLiveStreamLatest')
      .then((res) => {
        console.log(res);
        const result = apiValidation(res);
        const jitsiDomain = result.server_url.split('/')[2];

        this.setState({
          domain: jitsiDomain,
          jitsiRoomName: streamLink,
          jitsiToken: result.user_auth ? result.jwt_token : null,
          triggerJitsi: false, // here earlier was (method === 'sdk') for sdk method jisti meet
        });

        this.rerenderArrays();
        this.handleCloseGoLive();

        this.openJitsiInNewWindow(
          result.server_url,
          streamLink,
          userProfile.firstName,
          userProfile.lastName,
          result.user_auth ? result.jwt_token : null,
        );
      })
      .catch((e) => {
        console.error(e);
      });
  };

  createStream = (id) => {
    console.log(id);
    const { duration, selectedBatches, jitsiFirstName, jitsiLastName } = this.state;
    const { clientUserId, clientId, roleArray } = this.props;
    // const durationArray = duration.split(':');
    const durationArray = [];
    durationArray.push(duration.hours, duration.minutes, duration.seconds);
    console.log(durationArray);

    const milliseconds = 1 * 3600000 + 0 * 60 + 0 * 1000;
    // (durationArray[0] * 3600 + durationArray[1] * 60 + durationArray[2]) * 1000;
    if (Number.isNaN(Number(milliseconds))) {
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: 'Please input the complete duration.',
      });

      return;
    }
    const batchIdArray = JSON.stringify(selectedBatches.map((elem) => elem.client_batch_id));
    if (id === 'jitsi')
      this.createJitsiStream(batchIdArray, milliseconds.toString(), clientId, clientUserId);
    else if (id === 'big_blue_button') {
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

  closeYoutubeModal = () => this.setState({ showYoutubeModal: false, youtubeModalType: '' });

  openYoutubeModal = () => this.setState({ showYoutubeModal: true });

  openZoomPasscodeModal = () => this.setState({ zoomPasscodeModal: true });

  closeZoomModal = () =>
    this.setState({
      showZoomModal: false,
      youtubeModalType: '',
      zoomMeeting: '',
      zoomPassCode: '',
      zoomMeetingLink: '',
    });

  openZoomModal = () => this.setState({ showZoomModal: true });

  openMeetModal = () => this.setState({ showMeetModal: true });

  closeMeetModal = () => this.setState({ showMeetModal: false, youtubeModalType: '' });

  createZoomMeeting = () => {
    const {
      zoomMeeting,
      zoomPassCode,
      selectedBatches,
      duration,
      youtubeModalType,
      jitsiFirstName,
      jitsiLastName,
      zoomMeetingLink,
    } = this.state;
    const { clientUserId, clientId, roleArray } = this.props;
    const batchIdArray = JSON.stringify(selectedBatches.map((elem) => elem.client_batch_id));
    console.log(selectedBatches);
    const durationArray = [];
    durationArray.push(duration.hours, duration.minutes, duration.seconds);
    console.log(durationArray);
    const milliseconds = 3600000;
    // (durationArray[0] * 3600 + durationArray[1] * 60 + durationArray[2]) * 1000;
    let zoomPwd = '';
    let zoomIdFromLink = '';
    if (!zoomMeeting && zoomMeetingLink) {
      zoomPwd = zoomMeetingLink.split('pwd=')[1];
      zoomIdFromLink = zoomMeetingLink.split('?pwd=')[0].split('/').pop();
    }

    const payload = {
      meeting_id: zoomMeeting.split(' ').join('') || zoomIdFromLink,
      client_user_id: clientUserId,
      password: zoomPassCode || zoomPwd,
      batch_array: batchIdArray,
      duration: milliseconds,
    };
    console.log(zoomPwd, 'pwd');

    if (!(youtubeModalType === 'scheduled')) {
      post(payload, '/addZoomMeeting').then((res) => {
        console.log(res);
        if (res.success) {
          this.rerenderArrays();
          this.closeZoomModal();
          this.handleCloseGoLive();
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
              // const apiKeys = {
              //   apiKey: process.env.REACT_APP_ZOOM_SDK_KEY,
              //   apiSecret: process.env.REACT_APP_ZOOM_SDK_SECRET,
              // };
              if (zoomMeeting) {
                window.open(`https://zoom.us/j/${zoomMeeting}?pwd=${zoomPassCode}`);
              } else if (zoomMeetingLink) {
                window.open(`https://us04web.zoom.us/j/${zoomIdFromLink}?pwd=${zoomPwd}`);
              }
            }
          });
        }
      });
    }
    if (youtubeModalType === 'scheduled') {
      if (zoomMeeting) {
        window.open(`https://zoom.us/j/${zoomMeeting}?pwd=${zoomPassCode}`);
      } else if (zoomMeetingLink) {
        window.open(`https://us04web.zoom.us/j/${zoomIdFromLink}?pwd=${zoomPwd}`);
      }
      this.rerenderArrays();
    }
  };

  createGoogleMeeting = () => {
    const {
      googleMeeting,
      selectedBatches,
      duration,
      youtubeModalType,
      jitsiLastName,
      jitsiFirstName,
      scheduledMeet,
    } = this.state;
    const { clientUserId, clientId, roleArray, userProfile } = this.props;
    const batchIdArray = JSON.stringify(selectedBatches.map((elem) => elem.client_batch_id));

    const durationArray = [];
    durationArray.push(duration.hours, duration.minutes, duration.seconds);
    console.log(durationArray);
    const milliseconds = 3600000;
    // (durationArray[0] * 3600 + durationArray[1] * 60 + durationArray[2]) * 1000;

    const payload = {
      meeting_id: googleMeeting.split('/').pop(),
      client_user_id: clientUserId,
      batch_array: batchIdArray,
      duration: milliseconds,
    };

    if (!(youtubeModalType === 'scheduled')) {
      post(payload, '/addGoogleMeeting').then((res) => {
        if (res.success) {
          this.rerenderArrays();
          this.handleCloseGoLive();
          Swal.fire({
            title: 'Success',
            text:
              'Meeting Created Successfully. Students will be able to join the meeting using the code you provided.',
            icon: 'success',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            test: 'Meeting Creation failed.',
            timer: 3000,
          });
        }
      });
    }

    if (youtubeModalType === 'scheduled') {
      const scPayload = {
        client_user_id: clientUserId,
        stream_id: scheduledMeet.stream_id,
        client_id: clientId,
        name: `${userProfile.firstName} ${userProfile.lastName}`,
        contact: `${userProfile.contact}`,
        google_meet_id: googleMeeting.split('/').pop(),
        meeting_id: googleMeeting.split('/').pop(),
      };

      console.log(scPayload);
      post(scPayload, '/startGoogleStream').then((resp) => {
        console.log(resp);
        this.rerenderArrays();
        Swal.fire({
          title: 'Success',
          text:
            'Meeting Created Successfully. Students will be able to join the meeting using the code you provided.',
          icon: 'success',
        });
        // const result = apiValidation(resp);
        // this.setState({ showGoLiveModal: false });
        // window.open(result.conference_link, '_blank');
      });
    }

    this.closeMeetModal();
  };

  createYoutubeLive = () => {
    const {
      selectedBatches,
      jitsiFirstName,
      jitsiLastName,
      youtubeStreamLink,
      youtubeModalType,
      scheduledYTLive,
    } = this.state;
    const { clientUserId, clientId, roleArray, userProfile } = this.props;
    if (!youtubeStreamLink) return;
    const batchIdArray = JSON.stringify(selectedBatches.map((elem) => elem.client_batch_id));
    let vidId = youtubeStreamLink.split('v=')[1];
    const ampersandPosition = vidId?.indexOf('&');
    if (ampersandPosition != -1) {
      vidId = vidId?.substring(0, ampersandPosition);
    }
    const payload = {
      meeting_id: youtubeStreamLink,
      client_user_id: clientUserId,
      batch_array: batchIdArray,
      client_id: clientId,
      name: `${jitsiFirstName} ${jitsiLastName}`,
    };

    if (!(youtubeModalType === 'scheduled')) {
      post(payload, '/startInstantYoutubeStream').then((res) => {
        if (res.success) {
          this.rerenderArrays();
          this.handleCloseGoLive();
          Swal.fire({
            title: 'Success',
            text:
              'Stream Created Successfully. Students will be able to join the Stream using the Link you provided.',
            icon: 'success',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            test: 'Meeting Creation failed.',
            timer: 3000,
          });
        }
      });
    } else if (youtubeModalType === 'scheduled') {
      const scPayload = {
        client_user_id: clientUserId,
        stream_id: scheduledYTLive.stream_id,
        meeting_id: youtubeStreamLink,
        client_id: clientId,
        name: `${userProfile.firstName} ${userProfile.lastName}`,
        contact: `${userProfile.contact}`,
      };
      post(scPayload, '/startYoutubeStream').then((resp) => {
        console.log(resp);
        if (resp.success) {
          Swal.fire({
            title: 'Success',
            text:
              'Stream Created Successfully. Students will be able to join the Stream using the Link provided.',
            icon: 'success',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            test: 'Meeting Creation failed.',
            timer: 3000,
          });
        }
        // const result = apiValidation(resp);
        // window.open(result.conference_link, '_blank');
      });
    }
    history.push({ pathname: '/videoplayer', state: { link: vidId } });

    this.closeYoutubeModal();
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

  launchLiveClassNow = () => {
    const { selectedStreamType } = this.state;
    if (selectedStreamType === 'jitsi' || selectedStreamType === 'big_blue_button') {
      this.createStream(selectedStreamType);
    } else if (selectedStreamType === 'zoom') {
      this.openZoomModal();
    } else if (selectedStreamType === 'meet') {
      this.openMeetModal();
    } else if (selectedStreamType === 'youtube') {
      this.openYoutubeModal();
    }

    this.setState({
      showGoLiveModal: false,
      // selectedBatches: [],
      scheduledDate: '',
      liveClassTopic: '',
      scheduledTime: '',
    });
  };

  startAlphaStreamScheduled = (elem) => {
    const { userProfile, clientId, clientUserId } = this.props;
    const streamLink = `${Date.now()}${clientId}${clientUserId}`;
    const payload = {
      stream_link: streamLink,
      stream_id: elem.stream_id,
      client_user_id: clientUserId,
      client_id: clientId,
      name: `${userProfile.firstName} ${userProfile.lastName}`,
      contact: `${userProfile.contact}`,
    };

    post(payload, '/startAlphaStream').then((resp) => {
      console.log(resp);
      const result = apiValidation(resp);
      this.setState({ showGoLiveModal: false });
      window.open(result.conference_link, '_blank');
      window.location.reload();
    });
  };

  startBigBlueLiveStreamScheduled = (elem) => {
    const { userProfile, clientId, clientUserId } = this.props;
    const streamLink = `${Date.now()}${clientId}${clientUserId}`;
    const payload = {
      client_user_id: clientUserId,
      stream_id: elem.stream_id,
      client_id: clientId,
      name: `${userProfile.firstName} ${userProfile.lastName}`,
      contact: `${userProfile.contact}`,
    };

    post(payload, '/startBetaStream').then((resp) => {
      console.log(resp);
      // const result = apiValidation(resp);
      // this.setState({ showGoLiveModal: false });
      // window.open(result.conference_link, '_blank');
    });
  };

  startZoomLiveStreamScheduled = (elem) => {
    console.log(elem);
    const { userProfile, clientId, clientUserId } = this.props;
    const streamLink = `${Date.now()}${clientId}${clientUserId}`;
    const payload = {
      client_user_id: clientUserId,
      zoom_stream_id: elem.zoom_stream_id,
      stream_id: elem.stream_id,
      client_id: clientId,
      name: `${userProfile.firstName} ${userProfile.lastName}`,
      contact: `${userProfile.contact}`,
      meeting_id: elem.meeting_id,
      password: elem.password,
    };

    this.setState({
      youtubeModalType: 'scheduled',
    });

    post(payload, '/startZoomStream').then((resp) => {
      console.log(resp);
      const result = apiValidation(resp);
      this.setState({
        showGoLiveModal: false,
        zoomMeeting: resp.zoom_meeting_id,
        zoomPassCode: resp.password,
      });
      this.openZoomModal();
      // window.open(`https://zoom.us/j/${resp.zoom_meeting_id}?pwd=${resp.password}`);
      // this.openZoomModal();
      // window.open(result.conference_link, '_blank');
    });
  };

  startGoogleLiveStreamScheduled = (elem) => {
    const { userProfile, clientId, clientUserId } = this.props;
    const streamLink = `${Date.now()}${clientId}${clientUserId}`;

    this.setState({ youtubeModalType: 'scheduled', scheduledMeet: elem });
    console.log(elem);
    this.openMeetModal();
  };

  startYoutubeLiveStreamScheduled = (elem) => {
    const { userProfile, clientId, clientUserId } = this.props;
    const streamLink = `${Date.now()}${clientId}${clientUserId}`;

    this.setState({ youtubeModalType: 'scheduled', scheduledYTLive: elem });
    this.openYoutubeModal();
  };

  startScheduledLiveStream = (elem) => {
    const type = elem.stream_type;
    if (type === 'jitsi') {
      this.startAlphaStreamScheduled(elem);
      console.log('alpha started');
    } else if (type === 'big_blue_button') {
      this.startBigBlueLiveStreamScheduled(elem);
      console.log('beta started');
    } else if (type === 'zoom') {
      this.startZoomLiveStreamScheduled(elem);
      console.log('zoom started');
    } else if (type === 'meet') {
      this.startGoogleLiveStreamScheduled(elem);
      console.log('meet started');
    } else if (type === 'youtube') {
      this.startYoutubeLiveStreamScheduled(elem);
      console.log('ytube started');
    }

    document.getElementById('liveTab')?.click();
  };

  scheduleLiveClass = () => {
    const {
      scheduledDate,
      scheduledFrequency,
      scheduledTime,
      liveClassTopic,
      selectedBatches,
      selectedStreamType,
      jitsiLastName,
      jitsiFirstName,
    } = this.state;
    const { clientUserId, userProfile, clientId, roleArray } = this.props;
    const formattedScheduledFrequency = scheduledFrequency.split(' ').join('_').toLowerCase();
    const formattedDate = Date.parse(scheduledDate);
    const formattedTimeArray = scheduledTime.split(':');
    const formattedTime =
      +formattedTimeArray[0] * 60 * 60 + +formattedTimeArray[1] * 60 + +formattedTimeArray[2];
    const startTime = formattedDate / 1000 + formattedTime;
    console.log(userProfile);
    const formattedBatchesArray = selectedBatches.map((ele) => ele.client_batch_id);
    const payload = {
      client_user_id: clientUserId,
      stream_start_time: startTime,
      topic: liveClassTopic,
      batch_array: JSON.stringify(formattedBatchesArray),
      frequency: formattedScheduledFrequency,
      type: selectedStreamType,
      name: `${userProfile.firstName} ${userProfile.lastName}`,
    };

    console.log(payload);
    post(payload, '/scheduleLiveClass').then((res) => {
      console.log(res);
      this.rerenderArrays();
      this.handleCloseGoLive();
      if (res.success) {
        document.getElementById('scheduleTab')?.click();
        Swal.fire({
          title: 'Success',
          text: 'Meeting Scheduled successfully.',
          icon: 'success',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          test: 'Meeting failed to schedule.',
          timer: 3000,
        });
      }
      this.setState({
        showGoLiveModal: false,
        scheduledDate: '',
        liveClassTopic: '',
        scheduledTime: '',
        scheduledFrequency: 'Do not repeat',
      });
    });
  };

  deleteScheduledClass = (stream) => {
    const payload = {
      stream_id: stream.stream_id,
      stream_type: stream.stream_type,
    };

    console.log(stream);
    const { myScheduled, liveArray } = this.state;

    if (stream.frequency === 'do_not_repeat') {
      post(payload, '/deleteLiveStreamLatest').then((res) => {
        console.log(res);
        Swal.fire({
          title: 'Success',
          text: 'Meeting deleted successfully',
          icon: 'success',
        });
        this.rerenderArrays();
        this.setState({ existingStream: {}, doesLiveStreamExist: false });
      });
    } else {
      this.setState({ showAskToDeleteModal: true, streamToBeDeleted: stream });
    }
  };

  showStartNow = (elem) => {
    elem.isToBeLive = true;
  };

  deleteScheduledClassByAsking = () => {
    const { streamToBeDeleted, deleteMethod } = this.state;
    const payload = {
      stream_id: streamToBeDeleted.stream_id,
      stream_type: streamToBeDeleted.stream_type,
    };

    console.log(streamToBeDeleted, deleteMethod);

    if (deleteMethod === 'one') {
      post(payload, '/deleteLiveStreamLatest').then((res) => {
        console.log(res);
        Swal.fire({
          title: 'Success',
          text: 'Meeting deleted successfully',
          icon: 'success',
        });
        this.rerenderArrays();
        this.setState({
          existingStream: {},
          doesLiveStreamExist: false,
          deleteMethod: '',
          streamToBeDeleted: {},
          showAskToDeleteModal: false,
        });
      });
    } else if (deleteMethod === 'all') {
      post(payload, '/deleteLiveStreamCompletely').then((res) => {
        console.log(res);
        Swal.fire({
          title: 'Success',
          text: 'Meetings deleted successfully',
          icon: 'success',
        });
        this.rerenderArrays();
        this.setState({
          existingStream: {},
          doesLiveStreamExist: false,
          deleteMethod: '',
          showAskToDeleteModal: false,
          streamToBeDeleted: {},
        });
      });
    }
  };
  render() {
    const {
      adminBatches,
      batches,
      liveClassTopic,
      scheduledFrequency,
      scheduledTime,
      scheduledDate,
      youtubeStreamLink,
      inputValue,
      showModal,
      showGoLiveModal,
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
      showYoutubeModal,
      durationValue,
      zoomPasscodeModal,
      copiedToClipboard,
      jitsiToken,
      showMeetModal,
      googleMeeting,
      studentScheduledClasses,
      pageTitle,
      myScheduled,
      liveArray,
      toBeLive,
      allLiveClasses,
      deleteMethod,
      streamToBeDeleted,
      showAskToDeleteModal,
      zoomMeetingIdInput,
      zoomMeetingLink,
    } = this.state;
    const { dashboardData } = this.props;
    return (
      <div css={LiveClassesStyle.liveClasses}>
        <PageHeader title={pageTitle} />

        {role === 'teacher' && (
          <div className={classes.pageHeader}>
            <div className={classes.pageHeaderDiv}>
              <div className='mt-3'>
                <p className={classes.pageHeader_h4}>Go Live now!!!</p>
                <p className={classes.plageHeader_p}>
                  Conduct all your live classes here effectively.
                </p>
              </div>
              <img
                className={classes.feature_icon}
                src={dashboardData.feature.liveClasses.feature_icon}
              />
            </div>
          </div>
        )}

        {!triggerJitsi && role === 'student' && (
          <div style={{ marginTop: '65px' }}>
            {studentScheduledClasses.length > 0 ? (
              studentScheduledClasses.map((elem) => {
                const startTimeText = new Date(+elem.stream_start_time * 1000).toString();
                const date = startTimeText.split(' ').slice(1, 3).join(' ');
                const timeArray = startTimeText.split(' ')[4].split(':');
                let time = '';
                const timeLeftInSeconds = +elem.stream_start_time - +elem.current_time;
                const timeLeft = new Date(timeLeftInSeconds * 1000).toISOString().substr(11, 8);
                if (timeArray[0] > 12) {
                  time = `${timeArray[0] - 12}:${timeArray[1]} PM`;
                } else {
                  time = `${timeArray[0]}:${timeArray[1]} AM`;
                }
                if (elem.stream_status === 'active') {
                  time = 'LIVE!';
                }
                let batchesText = '';
                if (elem.batch_array.length > 1) {
                  batchesText = `with ${elem.batch_array[0]} and ${elem.batch_array.length - 1} ${
                    elem.batch_array.length - 1 > 1 ? 'others' : 'other'
                  }`;
                } else if (elem.batch_array.length === 1) {
                  batchesText = `with ${elem.batch_array[0]}`;
                }
                return (
                  <Card key={elem.stream_id} className='scheduleCard'>
                    <div className='scheduleCardLeft'>
                      <p className='scheduleCardHeading'>
                        <span className='redTag'>LIVE</span> Class
                      </p>
                      <p className='scheduleCardText'>
                        by {`${elem.first_name} ${elem.last_name}`}
                      </p>
                      <p className='scheduleCardSmallText'>{batchesText}</p>
                      <h5 className='scheduleCardHeading my-3'>{elem.topic}</h5>
                      {elem.stream_status === 'pending' && (
                        <p className='scheduleCardText'>
                          starts @ {time} on {date}
                        </p>
                      )}
                      {elem.stream_status === 'active' && (
                        <>
                          <p
                            style={{ fontFamily: 'Montserrat-Bold' }}
                            className='scheduleCardHeading'
                          >
                            Live Class is in progress...
                          </p>
                          <button
                            onClick={() => this.startLiveStream(elem)}
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
                );
                // return (
                //   <Card
                //     key={elem.stream_id}
                //     css={LiveClassesStyle.card}
                //     className='mx-auto p-2 mb-3 mb-lg-5'
                //   >
                //     <div css={LiveClassesStyle.adminCard} className='p-2'>
                //       <h6 css={LiveClassesStyle.adminHeading} className='mb-0'>
                //         {elem.first_name} {elem.last_name} is streaming Live
                //       </h6>
                //       <p css={LiveClassesStyle.adminCardTime} className='mb-0'>
                //         {format(fromUnixTime(elem.created_at), 'HH:mm MMM dd, yyyy')}
                //       </p>

                //       <p css={LiveClassesStyle.adminDuration}>
                //         Duration:{' '}
                //         <span css={LiveClassesStyle.adminDurationSpan}>
                //           {`${Math.floor(elem.duration / 3600000)} hr ${Math.floor(
                //             (elem.duration % 3600) / 60,
                //           )} min `}
                //         </span>
                //       </p>

                //       <p css={LiveClassesStyle.adminBatches}>
                //         Streaming In :{' '}
                //         <Readmore maxcharactercount={100} batchesArray={elem.batch_array} />
                //       </p>
                //       <Row className='justify-content-center mb-2 mb-lg-4'>
                //         <Button
                //           variant='customPrimary'
                //           size='sm'
                //           onClick={() => this.startLiveStream(elem)}
                //         >
                //           Attend Live Now!
                //         </Button>
                //       </Row>
                //     </div>
                //   </Card>
                // );
              })
            ) : (
              <p className='text-center m-4'> </p>
            )}
            <Modal show={zoomPasscodeModal} onHide={this.closeZoomPasscodeModal} centered>
              <Modal.Header closeButton>
                <Modal.Title>
                  {zoomPassCode.length > 25 ? 'Join Meeting' : 'Copy PassCode'}
                </Modal.Title>
              </Modal.Header>
              {zoomPassCode.length < 25 && (
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
              )}
              <Modal.Footer>
                <Button variant='boldTextSecondary' onClick={this.closeZoomPasscodeModal}>
                  Cancel
                </Button>
                <Button
                  variant='boldText'
                  onClick={() => {
                    window.open(`https://zoom.us/j/${zoomMeeting}?pwd=${zoomPassCode}`);
                  }} //eslint-disable-line
                >
                  Attend Meeting Now!
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        )}

        {triggerJitsi && (
          <Jitsi
            domain={domain}
            jitsiDisplayHide={this.jitsiDisplayHide}
            firstName={jitsiFirstName}
            lastName={jitsiLastName}
            roomName={jitsiRoomName}
            role={role}
            token={jitsiToken}
          />
        )}
        {role === 'teacher' && (
          <Tabs
            style={{ marginTop: '2rem' }}
            defaultActiveKey='Live'
            className='Profile__Tabs'
            justify
          >
            <Tab id='liveTab' eventKey='Live' title='Live'>
              {!triggerJitsi && role === 'teacher' && (
                <>
                  {/* {liveArray.map((existing) => {
                    return (
                      <div css={LiveClassesStyle.adminCard} className='p-2 m-3'>
                        <h6 css={LiveClassesStyle.adminHeading} className='mb-0'>
                          Ongoing Live Stream
                        </h6>
                        <p css={LiveClassesStyle.adminCardTime} className='mb-0'>
                          {format(fromUnixTime(existing.created_at), 'HH:mm MMM dd, yyyy')}
                        </p>

                        <p css={LiveClassesStyle.adminDuration}>
                          Duration:{' '}
                          <span css={LiveClassesStyle.adminDurationSpan}>
                            {`${Math.floor(existing.duration / 3600000)} hr ${Math.floor(
                              (existing.duration % 3600) / 60,
                            )} min `}
                          </span>
                        </p>

                        <p css={LiveClassesStyle.adminBatches}>
                          Streaming In :{' '}
                          <Readmore maxcharactercount={100} batchesArray={existing.batch_array} />
                        </p>
                        <Row className='justify-content-center mb-2 mb-lg-4'>
                          <Col xs={9} className='text-center'>
                            <Button
                              variant='customPrimary'
                              size='sm'
                              onClick={() => this.rejoinLiveStream(existing)}
                            >
                              Rejoin
                            </Button>
                          </Col>
                          <Col>
                            <DeleteIcon
                              onClick={() => {
                                this.deleteLiveStream(existing);
                                this.deleteScheduledClass(existing);
                              }}
                            />
                          </Col>
                        </Row>
                      </div>
                    );
                  })} */}

                  {liveArray.map((elem) => {
                    const startTimeText = new Date(+elem.stream_start_time * 1000).toString();
                    const date = startTimeText.split(' ').slice(1, 3).join(' ');
                    const timeArray = startTimeText.split(' ')[4].split(':');
                    let time = '';
                    const timeLeftInSeconds = +elem.stream_start_time - +elem.current_time;
                    const timeLeft = new Date(timeLeftInSeconds * 1000).toISOString().substr(11, 8);
                    time = 'LIVE!';
                    let batchesText = '';
                    if (elem.batch_array.length > 1) {
                      batchesText = `with ${elem.batch_array[0]} and ${
                        elem.batch_array.length - 1
                      } ${elem.batch_array.length - 1 > 1 ? 'others' : 'other'}`;
                    } else if (elem.batch_array.length === 1) {
                      batchesText = `with ${elem.batch_array[0]}`;
                    }
                    return (
                      <Card key={elem.stream_id} className='scheduleCard'>
                        <div className='scheduleCardLeft'>
                          <p className='scheduleCardHeading'>
                            <span className='redTag'>LIVE</span> Class
                          </p>
                          <p className='scheduleCardText'>
                            by {`${elem.first_name} ${elem.last_name}`}
                          </p>
                          <p className='scheduleCardSmallText'>{batchesText}</p>
                          <h5 className='scheduleCardHeading my-3'>{elem.topic}</h5>
                          <p
                            style={{ fontFamily: 'Montserrat-Bold' }}
                            className='scheduleCardHeading'
                          >
                            Your Live Class is in progress...
                          </p>
                          <button
                            onClick={() => this.rejoinLiveStream(elem)}
                            type='button'
                            className='startNowButton w-100 blackBackground'
                          >
                            REJOIN
                          </button>
                        </div>
                        <div className='scheduleCardRight'>
                          {timeLeftInSeconds < 86400 && (
                            <TimerWatch
                              isLive
                              startedProp={timeLeftInSeconds < 0}
                              time={timeLeft}
                            />
                          )}
                          {timeLeftInSeconds >= 86400 && (
                            <img className='teacherImage' src={teacherImg} alt='icon' />
                          )}
                          {/* eslint-disable */}
                          <div
                            onClick={() => {
                              this.deleteLiveStream(elem);
                              this.deleteScheduledClass(elem);
                            }}
                            className='deleteContainer'
                          >
                            <DeleteIcon style={{ color: '#00000061' }} />
                          </div>
                        </div>
                      </Card>
                    );
                  })}

                  {liveArray.length <= 0 && (
                    <>
                      {/* <Card css={LiveClassesStyle.card} className='mx-auto mt-5 p-3'>
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
                    </Card> */}
                      {toBeLive.map((elem) => {
                        const startTimeText = new Date(+elem.stream_start_time * 1000).toString();
                        const date = startTimeText.split(' ').slice(1, 3).join(' ');
                        const timeArray = startTimeText.split(' ')[4].split(':');
                        let time = '';
                        const timeLeftInSeconds = +elem.stream_start_time - +elem.current_time;
                        const timeLeft = new Date(timeLeftInSeconds * 1000)
                          .toISOString()
                          .substr(11, 8);
                        if (timeArray[0] > 12) {
                          time = `${timeArray[0] - 12}:${timeArray[1]} PM`;
                        } else {
                          time = `${timeArray[0]}:${timeArray[1]} AM`;
                        }
                        let batchesText = '';
                        if (elem.batch_array.length > 1) {
                          batchesText = `with ${elem.batch_array[0]} and ${
                            elem.batch_array.length - 1
                          } ${elem.batch_array.length - 1 > 1 ? 'others' : 'other'}`;
                        } else if (elem.batch_array.length === 1) {
                          batchesText = `with ${elem.batch_array[0]}`;
                        }
                        return (
                          <Card key={elem.stream_id} className='scheduleCard'>
                            <div className='scheduleCardLeft'>
                              <p className='scheduleCardHeading'>
                                <span className='redTag'>LIVE</span> Class
                              </p>
                              <p className='scheduleCardText'>
                                by {`${elem.first_name} ${elem.last_name}`}
                              </p>
                              <p className='scheduleCardSmallText'>{batchesText}</p>
                              <h5 className='scheduleCardHeading my-3'>{elem.topic}</h5>
                              <p className='scheduleCardText'>
                                starts @ {time} on {date}
                              </p>
                              <button
                                onClick={() => this.startScheduledLiveStream(elem)}
                                type='button'
                                className='startNowButton'
                              >
                                START NOW
                              </button>
                            </div>
                            <div className='scheduleCardRight'>
                              {timeLeftInSeconds < 86400 && (
                                <TimerWatch startedProp={timeLeftInSeconds < 0} time={timeLeft} />
                              )}
                              {timeLeftInSeconds >= 86400 && (
                                <img className='teacherImage' src={teacherImg} alt='icon' />
                              )}
                              {/* eslint-disable */}
                              <div
                                onClick={() => this.deleteScheduledClass(elem)}
                                className='deleteContainer'
                              >
                                <DeleteIcon style={{ color: '#00000061' }} />
                              </div>
                            </div>
                          </Card>
                        );
                      })}

                      <div className='my-4 mt-lg-5 mx-2'>
                        {dashboardData.live_class_platform.alpha ? (
                          <Card
                            onClick={() => {
                              this.setState({ selectedStreamType: 'jitsi', showModal: true });
                            }}
                            className='typeCard mx-auto mt-5 p-3'
                          >
                            {/* <Button
                            variant='customPrimarySmol'
                            size='sm'
                            onClick={(e) => this.createStream(e.target.id)}
                            disabled={!selectedBatches.length || !duration}
                            id='alpha'
                            style={{ fontSize: '9px' }}
                          >
                            Go Live Alpha!
                          </Button> */}
                            <div className='cardTextContainer mr-3'>
                              <p className='cardHeading alphaColor'>Alpha Live</p>
                              <p className='cardText alphaColor'>
                                Free unlimited live classes with recording, screen sharing & OBS
                                compatibility.
                              </p>
                            </div>
                            <div>
                              <img className='cardImage' src={alphaSvg} alt='Apha' />
                            </div>
                          </Card>
                        ) : null}
                        {dashboardData.live_class_platform.beta ? (
                          <Card
                            onClick={() => {
                              this.setState({
                                selectedStreamType: 'big_blue_button',
                                showModal: true,
                              });
                            }}
                            className='typeCard mx-auto mt-5 p-3'
                          >
                            {/* <Button
                            variant='customPrimarySmol'
                            size='sm'
                            onClick={(e) => this.createStream(e.target.id)}
                            disabled={!selectedBatches.length || !duration}
                            id='beta'
                            style={{ fontSize: '9px' }}
                          >
                            Go Live Beta!
                          </Button> */}
                            <div className='cardTextContainer mr-3'>
                              <p className='cardHeading betaColor'>Beta Live</p>
                              <p className='cardText betaColor'>
                                Free unlimited live classes with recording, screen sharing & OBS
                                compatibility.
                              </p>
                            </div>
                            <div>
                              <img className='cardImage' src={betaSvg} alt='Beta' />
                            </div>
                          </Card>
                        ) : null}
                        {dashboardData.live_class_platform.zoom ? (
                          <Card
                            onClick={() => {
                              this.setState({ selectedStreamType: 'zoom', showModal: true });
                            }}
                            className='typeCard mx-auto mt-5 p-3'
                          >
                            {/* <Button
                            variant='customPrimarySmol'
                            size='sm'
                            onClick={(e) => this.openZoomModal()}
                            disabled={!selectedBatches.length || !duration}
                            id='beta'
                            style={{ fontSize: '9px' }}
                          >
                            Go Live Zoom!
                          </Button> */}
                            <div className='cardTextContainer mr-3'>
                              <p className='cardHeading zoomColor'>Zoom Live</p>
                              <p className='cardText zoomColor'>
                                Start ZOOM classes right from your own app. No need to share link,
                                users can join directly.
                              </p>
                            </div>
                            <div>
                              <img className='cardImage' src={zoomSvg} alt='Zoom' />
                            </div>
                          </Card>
                        ) : null}
                        {dashboardData.live_class_platform.meet ? (
                          <Card
                            onClick={() => {
                              this.setState({ selectedStreamType: 'meet', showModal: true });
                            }}
                            className='typeCard mx-auto mt-5 p-3'
                          >
                            {/* <Button
                            variant='customPrimarySmol'
                            size='sm'
                            onClick={(e) => this.openMeetModal()}
                            disabled={!selectedBatches.length || !duration}
                            id='beta'
                            style={{ fontSize: '9px' }}
                          >
                            Go Live Meet!
                          </Button> */}
                            <div className='cardTextContainer mr-3'>
                              <p className='cardHeading meetColor'>Google Meet</p>
                              <p className='cardText meetColor'>
                                Here you can find all the stuffs pre-loaded for you from Ingenium.
                              </p>
                            </div>
                            <div>
                              <img className='cardImage' src={meetSvg} alt='Google Meet' />
                            </div>
                          </Card>
                        ) : null}
                        {dashboardData.live_class_platform.youtube ? (
                          <Card
                            onClick={() => {
                              this.setState({ selectedStreamType: 'youtube', showModal: true });
                            }}
                            className='typeCard mx-auto mt-5 p-3'
                          >
                            {/* <Button
                            variant='customPrimarySmol'
                            size='sm'
                            onClick={(e) => this.openMeetModal()}
                            disabled={!selectedBatches.length || !duration}
                            id='beta'
                            style={{ fontSize: '9px' }}
                          >
                            Go Live Meet!
                          </Button> */}
                            <div className='cardTextContainer mr-3'>
                              <p className='cardHeading youtubeColor'>Youtube Live</p>
                              <p className='cardText youtubeColor'>
                                Here you can find all the stuffs pre-loaded for you from Ingenium.
                              </p>
                            </div>
                            <div>
                              <img className='cardImage' src={youtubeSvg} alt='Youtube Live' />
                            </div>
                          </Card>
                        ) : null}
                      </div>
                    </>
                  )}
                  {/* {adminBatches.length > 0 && (
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
                              <Readmore maxcharactercount={100} batchesArray={elem.batch_array} />
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
                )} */}

                  <Modal
                    show={showModal}
                    onHide={() => this.setState({ showModal: false, selectedBatches: [] })}
                    centered
                  >
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
                      <Button
                        disabled={selectedBatches.length <= 0}
                        variant='dashboardBlueOnWhite'
                        onClick={this.handleClose}
                      >
                        Next
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  <Modal
                    className='goLiveModal'
                    show={showGoLiveModal}
                    // show
                    onHide={this.handleCloseGoLive}
                    centered
                    dismissible
                  >
                    <Modal.Header closeButton> </Modal.Header>
                    <Modal.Body>
                      <button
                        onClick={() => this.launchLiveClassNow()}
                        className='btnGoLive'
                        type='button'
                      >
                        Go LIVE Now!
                      </button>
                      <Accordion className='btnGoLive bg-white py-3' key='0'>
                        <div className='w-100'>
                          <Accordion.Toggle className='d-flex w-100' as='div' eventKey='0'>
                            <div style={{ width: '90%' }} className='text-center'>
                              Schedule for later
                            </div>
                            <ExpandMoreIcon />
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey='0'>
                            <div className='container_modalForm'>
                              <label
                                htmlFor='Topic'
                                className='has-float-label my-auto w-100 margin-8'
                              >
                                <input
                                  className='form-control'
                                  name='Topic'
                                  type='text'
                                  placeholder='Topic'
                                  onChange={(e) =>
                                    this.setState({ liveClassTopic: e.target.value })
                                  }
                                  value={liveClassTopic}
                                />
                                <span>Topic</span>
                              </label>
                              <DatePicker
                                selected={scheduledDate}
                                minDate={addDays(new Date(), 0)}
                                className='w-100'
                                dateFormat='dd/MM/yyyy'
                                onChange={(date) => this.setState({ scheduledDate: date })}
                                customInput={<CustomInput />}
                              />
                              <label className='has-float-label my-auto w-100 margin-8'>
                                <input
                                  className='form-control'
                                  name='Start Time'
                                  type='time'
                                  step='1'
                                  placeholder='Start Time'
                                  value={scheduledTime}
                                  onChange={(e) => this.setState({ scheduledTime: e.target.value })}
                                />
                                <span onClick={() => {}}>Start Time</span>
                              </label>
                              <label className='has-float-label my-auto w-100 margin-18'>
                                <select
                                  style={{ boxShadow: 'none' }}
                                  className='form-control'
                                  name='Frequency'
                                  type='select'
                                  step='1'
                                  placeholder='Do not repeat'
                                  value={scheduledFrequency}
                                  onChange={(e) => {
                                    this.setState({ scheduledFrequency: e.target.value });
                                  }}
                                >
                                  <option value='Do not repeat'>Do not repeat</option>
                                  <option value='Daily'>Daily</option>
                                  <option value='Weekly'>Weekly</option>
                                  <option value='Monthly'>Monthly</option>
                                </select>
                                <span>Frequency</span>
                              </label>
                              <button
                                onClick={this.scheduleLiveClass}
                                type='button'
                                className='scheduleButton'
                                disabled={
                                  !scheduledDate ||
                                  !scheduledFrequency ||
                                  !scheduledTime ||
                                  !liveClassTopic
                                }
                              >
                                Schedule
                              </button>
                            </div>
                          </Accordion.Collapse>
                        </div>
                      </Accordion>
                    </Modal.Body>
                  </Modal>

                  {/* <Modal show centered onHide={this.closeZoomModal}> */}
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
                      {zoomMeetingIdInput && (
                        <>
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
                          </Row>{' '}
                        </>
                      )}
                      {!zoomMeetingIdInput && (
                        <Row className='mx-2 mt-2'>
                          <label className='has-float-label my-auto w-100'>
                            <input
                              className='form-control'
                              name='Meeting Link'
                              type='text'
                              placeholder='Meeting Link'
                              onChange={(e) => this.setState({ zoomMeetingLink: e.target.value })}
                              value={zoomMeetingLink}
                            />
                            <span>Meeting link</span>
                          </label>
                        </Row>
                      )}
                      <Row>
                        {zoomMeetingIdInput ? (
                          <p
                            className='zoomFormChanger'
                            onClick={() =>
                              this.setState({
                                zoomMeetingIdInput: false,
                                zoomPassCode: '',
                                zoomMeeting: '',
                              })
                            }
                          >
                            Or enter meeting link?
                          </p>
                        ) : (
                          <p
                            className='zoomFormChanger'
                            onClick={() =>
                              this.setState({ zoomMeetingIdInput: true, zoomMeetingLink: '' })
                            }
                          >
                            Enter ID and Password?
                          </p>
                        )}
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

                  <Modal show={showMeetModal} centered onHide={this.closeMeetModal}>
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
                            name='Meeting Id'
                            type='text'
                            placeholder='Meeting Id'
                            onChange={(e) => this.setState({ googleMeeting: e.target.value })}
                            value={googleMeeting}
                          />
                          <span>Meeting Id</span>
                        </label>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant='boldTextSecondary' onClick={() => this.closeMeetModal()}>
                        Cancel
                      </Button>
                      <Button variant='boldText' onClick={() => this.createGoogleMeeting()}>
                        Submit
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  <Modal show={showYoutubeModal} centered onHide={this.closeYoutubeModal}>
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
                            name='Youtube Link'
                            type='text'
                            placeholder='Youtube Link'
                            onChange={(e) => this.setState({ youtubeStreamLink: e.target.value })}
                            value={youtubeStreamLink}
                          />
                          <span>Youtube Link</span>
                        </label>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant='boldTextSecondary' onClick={() => this.closeYoutubeModal()}>
                        Cancel
                      </Button>
                      <Button variant='boldText' onClick={() => this.createYoutubeLive()}>
                        Submit
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  <Modal
                    show={showAskToDeleteModal}
                    // show
                    centered
                    onHide={() => this.setState({ showAskToDeleteModal: false, deleteMethod: '' })}
                  >
                    <Modal.Header closeButton>
                      <span
                        className='Scrollable__courseCardHeading my-auto'
                        style={{ fontSize: '14px', lineHeight: '18px' }}
                      >
                        The frequency of this live class is "{streamToBeDeleted.frequency}". Please
                        select if you want to delete this live class or delete all upcoming versions
                        of this live class.
                      </span>
                    </Modal.Header>
                    <Modal.Body>
                      <p
                        onClick={() => this.setState({ deleteMethod: 'one' })}
                        className={`borderedSelectors${
                          deleteMethod === 'one' ? ' selectedMethod' : ''
                        }`}
                      >
                        Delete this live class.
                      </p>
                      <p
                        onClick={() => this.setState({ deleteMethod: 'all' })}
                        className={`borderedSelectors${
                          deleteMethod === 'all' ? ' selectedMethod' : ''
                        }`}
                      >
                        Delete all upcoming versions of this live class.
                      </p>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant='boldTextSecondary'
                        onClick={() =>
                          this.setState({ showAskToDeleteModal: false, deleteMethod: false })
                        }
                      >
                        Cancel
                      </Button>
                      <Button variant='boldText' onClick={this.deleteScheduledClassByAsking}>
                        Delete
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  <Modal show={showDurationModal} onHide={this.closeDurationModal} centered>
                    {/* <DurationPicker
                    onChange={this.onDurationChange}
                    initialDuration={{ hours: 1, minutes: 2, seconds: 3 }}
                  /> */}
                    <CustomDurationPicker changed={this.onDurationChange} />
                    <Modal.Footer>
                      <Button variant='dashboardBlueOnWhite' onClick={this.closeDurationModal}>
                        Next
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </>
              )}
            </Tab>
            {liveArray.length <= 0 && (
              <Tab id='scheduleTab' eventKey='Schedule' title='Schedule'>
                {myScheduled.length > 0 ? (
                  myScheduled.map((elem) => {
                    toBeLive.forEach((ele) => {
                      if (ele.stream_id === elem.stream_id) {
                        elem.isToBeLive = true;
                      }
                    });
                    const startTimeText = new Date(+elem.stream_start_time * 1000).toString();
                    const date = startTimeText.split(' ').slice(1, 3).join(' ');
                    const timeArray = startTimeText.split(' ')[4].split(':');
                    let time = '';
                    const timeLeftInSeconds = +elem.stream_start_time - +elem.current_time;
                    const timeLeft = new Date(timeLeftInSeconds * 1000).toISOString().substr(11, 8);
                    if (timeArray[0] > 12) {
                      time = `${timeArray[0] - 12}:${timeArray[1]} PM`;
                    } else {
                      time = `${timeArray[0]}:${timeArray[1]} AM`;
                    }
                    let batchesText = '';
                    if (elem.batch_array.length > 1) {
                      batchesText = `with ${elem.batch_array[0]} and ${
                        elem.batch_array.length - 1
                      } ${elem.batch_array.length - 1 > 1 ? 'others' : 'other'}`;
                    } else if (elem.batch_array.length === 1) {
                      batchesText = `with ${elem.batch_array[0]}`;
                    }
                    return (
                      <Card key={elem.stream_id} className='scheduleCard'>
                        <div className='scheduleCardLeft'>
                          <p className='scheduleCardHeading'>
                            <span className='redTag'>LIVE</span> Class
                          </p>
                          <p className='scheduleCardText'>
                            by {`${elem.first_name} ${elem.last_name}`}
                          </p>
                          <p className='scheduleCardSmallText'>{batchesText}</p>
                          <h5 className='scheduleCardHeading my-3'>{elem.topic}</h5>
                          <p className='scheduleCardText'>
                            starts @ {time} on {date}
                          </p>
                          {elem.isToBeLive && (
                            <button
                              onClick={() => this.startScheduledLiveStream(elem)}
                              type='button'
                              className='startNowButton'
                            >
                              START NOW
                            </button>
                          )}
                        </div>
                        <div className='scheduleCardRight'>
                          {timeLeftInSeconds < 86400 && (
                            <TimerWatch
                              showStartNow={() => this.rerenderArrays()}
                              startedProp={timeLeftInSeconds < 0}
                              time={timeLeft}
                            />
                          )}
                          {timeLeftInSeconds >= 86400 && (
                            <img className='teacherImage' src={teacherImg} alt='icon' />
                          )}
                          {/* eslint-disable */}
                          <div
                            onClick={() => this.deleteScheduledClass(elem)}
                            className='deleteContainer'
                          >
                            <DeleteIcon style={{ color: '#00000061' }} />
                          </div>
                        </div>
                      </Card>
                    );
                  })
                ) : (
                  <h5
                    style={{ fontSize: '16px' }}
                    className='scheduleCardHeading justify-content-center d-flex mt-3 w-75 mx-auto'
                  >
                    No Live classes are scheduled at this moment.
                  </h5>
                )}
              </Tab>
            )}
            {liveArray.length <= 0 && (
              <Tab eventKey='Others' title='Others'>
                {allLiveClasses.length > 0 ? (
                  allLiveClasses.map((elem) => {
                    toBeLive.forEach((ele) => {
                      if (ele.stream_id === elem.stream_id) {
                        elem.isToBeLive = true;
                      }
                    });
                    const startTimeText = new Date(+elem.stream_start_time * 1000).toString();
                    const date = startTimeText.split(' ').slice(1, 3).join(' ');
                    const timeArray = startTimeText.split(' ')[4].split(':');
                    let time = '';
                    const timeLeftInSeconds = +elem.stream_start_time - +elem.current_time;
                    const timeLeft = new Date(timeLeftInSeconds * 1000).toISOString().substr(11, 8);
                    if (timeArray[0] > 12) {
                      time = `${timeArray[0] - 12}:${timeArray[1]} PM`;
                    } else {
                      time = `${timeArray[0]}:${timeArray[1]} AM`;
                    }
                    let batchesText = '';
                    if (elem.batch_array.length > 1) {
                      batchesText = `with ${elem.batch_array[0]} and ${
                        elem.batch_array.length - 1
                      } ${elem.batch_array.length - 1 > 1 ? 'others' : 'other'}`;
                    } else if (elem.batch_array.length === 1) {
                      batchesText = `with ${elem.batch_array[0]}`;
                    }
                    return (
                      <Card key={elem.stream_id} className='scheduleCard'>
                        <div className='scheduleCardLeft'>
                          <p className='scheduleCardHeading'>
                            <span className='redTag'>LIVE</span> Class
                          </p>
                          <p className='scheduleCardText'>
                            by {`${elem.first_name} ${elem.last_name}`}
                          </p>
                          <p className='scheduleCardSmallText'>{batchesText}</p>
                          <h5 className='scheduleCardHeading my-3'>{elem.topic}</h5>
                          <p className='scheduleCardText'>
                            starts @ {time} on {date}
                          </p>
                          {/* {elem.isToBeLive && (
                      <button
                        onClick={() => this.startScheduledLiveStream(elem)}
                        type='button'
                        className='startNowButton'
                      >
                        START NOW
                      </button>
                    )} */}
                        </div>
                        <div className='scheduleCardRight'>
                          {timeLeftInSeconds < 86400 && (
                            <TimerWatch startedProp={timeLeftInSeconds < 0} time={timeLeft} />
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
                    );
                  })
                ) : (
                  <h5
                    style={{ fontSize: '16px' }}
                    className='scheduleCardHeading justify-content-center d-flex mt-3 w-75 mx-auto'
                  >
                    No Live classes are scheduled at this moment.
                  </h5>
                )}
              </Tab>
            )}
            {/* <Tab eventKey='Recordings' title='Recordings'>
            {recordings.length > 0 ? (
              <div>
                {recordings.map((elem) => {
                  return (
                    <Accordion>
                      <Card
                        key={elem.stream_name}
                        css={LiveClassesStyle.card}
                        className='mx-auto p-2 mt-3'
                      >
                        <div css={LiveClassesStyle.adminCard} className='p-2'>
                          <h6 css={LiveClassesStyle.adminHeading} className='mb-0'>
                            {elem.first_name} {elem.last_name} is streaming Live
                          </h6>
                          <p css={LiveClassesStyle.adminCardTime} className='mb-0'>
                            {format(fromUnixTime(elem.created_at), 'HH:mm MMM dd, yyyy')}
                          </p>

                          {/* <p css={LiveClassesStyle.adminDuration}>
                            Duration:{' '}
                            <span css={LiveClassesStyle.adminDurationSpan}>
                              {`${Math.floor(elem.duration / 3600000)} hr ${Math.floor(
                                (elem.duration % 3600) / 60,
                              )} min `}
                            </span>
                          </p> 

                          <p css={LiveClassesStyle.adminBatches}>
                            Streamed In :{' '}
                            <Readmore maxcharactercount={100} batchesArray={elem.batch_array} />
                          </p>
                          <Accordion.Toggle as='div' eventKey='0'>
                            <Row className='m-2'>
                              <span>{elem.recording_link_array.length} Recordings Available</span>
                              <span className='ml-auto'>
                                <ExpandMoreIcon />
                              </span>
                            </Row>
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey='0'>
                            <div>
                              {elem.recording_link_array.map((e, i) => {
                                return (
                                  <Row className='m-3' css={LiveClassesStyle.watch} key={e}>
                                    {i + 1}. Recording {1 + i}{' '}
                                    <Button
                                      variant='customPrimary'
                                      size='sm'
                                      onClick={() => this.playRecording(e)}
                                    >
                                      Watch Recording
                                    </Button>
                                    {role === 'teacher' && (
                                      <Button
                                        variant='customPrimary'
                                        size='sm'
                                        onClick={() => this.handleDelete(elem)}
                                      >
                                        Delete Recording
                                      </Button>
                                    )}
                                  </Row>
                                );
                              })}
                            </div>
                          </Accordion.Collapse>
                        </div>
                      </Card>
                    </Accordion>
                  );
                })}
              </div>
            ) : (
              <p className='text-center m-4'>Oops! There are no recordings to show.</p>
            )}
          </Tab> */}
          </Tabs>
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
  dashboardData: getCurrentDashboardData(state),
});

export default connect(mapStateToProps)(LiveClasses);

LiveClasses.propTypes = {
  clientId: PropTypes.number.isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
  clientUserId: PropTypes.number.isRequired,
  userProfile: PropTypes.instanceOf(Object).isRequired,
  dashboardData: PropTypes.instanceOf(Object).isRequired,
};

CustomInput.propTypes = {
  value: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

// {elem.batch_array.map((e, i) => {
//   return (
//     <span css={LiveClassesStyle.adminBatchesSpan} key={`elem${e}`}>
//       {e}
//       {i < elem.batch_array.length - 1 ? ',' : ''}
//     </span>
//   );
// })}
