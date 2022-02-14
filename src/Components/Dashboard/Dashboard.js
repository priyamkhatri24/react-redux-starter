import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
import Skeleton from 'react-loading-skeleton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import PersonAddIcon from '@material-ui/icons/PersonAdd';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import PhoneIcon from '@material-ui/icons/Phone';
import LinkIcon from '@material-ui/icons/Link';
import io from 'socket.io-client';

import { connect } from 'react-redux';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import Toast from 'react-bootstrap/Toast';
import BottomNavigation from '../Common/BottomNavigation/BottomNavigation';
import GlobalSearchBar from '../Common/GlobalSearchBar/GlobalSearchBar';
import { getUserProfile } from '../../redux/reducers/userProfile.reducer';
import { getSocket, getGlobalMessageCount } from '../../redux/reducers/conversations.reducer';
import { server, get, apiValidation, prodOrDev, post } from '../../Utilities';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import userAvatar from '../../assets/images/user.svg';
import { userProfileActions } from '../../redux/actions/userProfile.action';
import { firstTimeLoginActions } from '../../redux/actions/firsttimeLogin.action';
import { clientUserIdActions } from '../../redux/actions/clientUserId.action';
import { testsActions } from '../../redux/actions/tests.action';
import { courseActions } from '../../redux/actions/course.action';
import {
  AspectCards,
  CoursesCards,
  DashboardCards,
  LiveClassesCards,
  DynamicCards,
} from '../Common';
import offlineAssignment from '../../assets/images/Dashboard/offline.svg';
import Tests from '../Tests/Tests';
import './Dashboard.scss';
import { admissionActions } from '../../redux/actions/admissions.action';
import YCIcon from '../../assets/images/ycIcon.png';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
import {
  getComeBackFromTests,
  getFirstTimeLoginState,
} from '../../redux/reducers/firstTimeLogin.reducer';
import { studyBinActions } from '../../redux/actions/studybin.actions';
import { homeworkActions } from '../../redux/actions/homework.action';
import fb from '../../assets/images/dummyDashboard/fb.png';
import linkedin from '../../assets/images/dummyDashboard/linkedin.svg';
import insta from '../../assets/images/dummyDashboard/instagram.svg';
import whatsapp from '../../assets/images/dummyDashboard/whatsapp.svg';
import youtube from '../../assets/images/dummyDashboard/youtube.png';
import telegram from '../../assets/images/dummyDashboard/telegram.svg';
import footerIngenium from '../../assets/images/ingiLOGO.png';
import '../Login/DummyDashboard.scss';
import { dashboardActions } from '../../redux/actions/dashboard.action';
import { analysisActions } from '../../redux/actions/analysis.action';
import { getCurrentRedirectPath } from '../../redux/reducers/dashboard.reducer';
import { getToken, onMessageListener } from '../../Utilities/firebase';
import { conversationsActions } from '../../redux/actions/conversations.action';

const DashBoardAdmissions = Loadable({
  loader: () => import('./DashBoardAdmissions'),
  loading() {
    return <Skeleton count={20} />;
  },
});

const Dashboard = (props) => {
  const {
    clientId,
    clientUserId,
    roleArray,
    userProfile: { firstName, profileImage, lastName },
    clearProfile,
    clearClientIdDetails,
    history,
    setDashboardDataToStore,
    setTestResultArrayToStore,
    setTestStartTimeToStore,
    setTestTypeToStore,
    setFirstTimeLoginToStore,
    setTestIdToStore,
    setHomeworkLanguageTypeToStore,
    setTestEndTimeToStore,
    setCourseIdToStore,
    setAdmissionRoleArrayToStore,
    branding,
    comeBackFromTests,
    setFolderIdArrayToStore,
    setAnalysisStudentObjectToStore,
    setTestLanguageToStore,
    redirectPath,
    firstTimeLogin,
    socket,
    setSocket,
    setSelectedCourseToStore,
    setSelectedChapterToStore,
    setSelectedSubjectToStore,
    setSelectedTypeToStore,
  } = props;
  const [time, setTime] = useState('');
  const [clientStatus, setClientStatus] = useState('');
  const [restrictionModal, setRestrictionModal] = useState(false);
  const [notices, setNotices] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [role, setRole] = useState(1);
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [admissions, setAdmissions] = useState({});
  const [studentLiveStream, setStudentLiveStream] = useState([]);
  const [data, setData] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const [globalMessageCountState, setGlobalMessageCountState] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [optionsModal, setOptionsModal] = useState(false);
  const openOptionsModal = () => {
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    setOptionsModal(true);
  };
  const closeOptionsModal = () => setOptionsModal(false);
  const [features, setFeatures] = useState([]);
  const [isToken, setIsToken] = useState(true);
  const [nameDisplay, setNameDisplay] = useState(false);

  // useEffect(() => {
  //   if (searchContainerRef?.current)
  //     document.addEventListener('scroll', () => {
  //       console.log(searchContainerRef?.current?.offSet());
  //     });

  //   return document.removeEventListener('scroll', () => {
  //     console.log('removed scroll listener');
  //   });
  // }, [searchContainerRef]);
  // const nameDisplayTimer = setTimeout(() => {
  //   setNameDisplayCounter(nameDisplayCounter + 1);
  //   if (nameDisplayCounter >= 3) {
  //     clearTimeout(nameDisplayTimer);
  //   }
  //   console.log('timer');
  // }, 1000);

  useEffect(
    function () {
      if (!socket) {
        for (let i = 0; i < 10; i++) {
          const sockett = io(server, {
            transports: ['websocket', 'polling'],
          });
          sockett.on('connect', () => {
            console.log(sockett.id, 'connect');
          });
          setSocket({ sockett });
          if (sockett) break;
        }
      }
      if (!socket) return () => {};
      socket?.emit('user-connected', { client_user_id: clientUserId });
      console.log(socket);
      socket?.on('socket-connected', () => {
        socket?.emit('user-connected', { client_user_id: clientUserId });
      });
      socket?.on('homeMessage', addMessageToGlobalCount);

      return () => {
        socket?.off('homeMessage', addMessageToGlobalCount);
      };
    },
    [socket],
  );

  const addMessageToGlobalCount = (messagedata) => {
    console.log(messagedata);
    setGlobalMessageCountState((prev) => prev + 1);
  };

  useEffect(() => {
    const nameDisplayTimer = setTimeout(() => {
      setNameDisplay(true);
    }, 3000);

    return () => {
      clearTimeout(nameDisplayTimer);
    };
  }, []);

  const getTopicArray = useCallback(() => {
    return new Promise((resolve, reject) => {
      const roleId = roleArray.includes(4)
        ? 4
        : roleArray.includes(3)
        ? 3
        : roleArray.includes(2)
        ? 2
        : 1;
      const currEnv = prodOrDev();
      const topicArray = [];
      topicArray.push(`${currEnv}institute${clientId}`);
      topicArray.push(`${currEnv}user${clientUserId}`);
      let result;
      if (roleId === 2 || roleId === 1) {
        get({ client_user_id: clientUserId }, '/getBatchesOfStudent').then((resp) => {
          result = apiValidation(resp);
          const topicArr = result.map((e) => `${currEnv}batch${e.client_batch_id}`);
          resolve([...topicArray, ...topicArr]);
        });
      } else if (roleId === 3) {
        get({ client_user_id: clientUserId }, '/getBatchesOfTeacher').then((resp) => {
          result = apiValidation(resp);
          const topicArr = result?.map((e) => `${currEnv}batch${e.client_batch_id}`);
          resolve([...topicArray, ...topicArr]);
        });
      } else {
        get({ client_id: clientId }, '/getAllBatchesOfCoaching').then((res) => {
          console.log(res);
          result = apiValidation(res);
          const topicArr = result.map((e) => `${currEnv}batch${e.client_batch_id}`);
          resolve([...topicArray, ...topicArr]);
        });
      }
    });
  }, [roleArray, clientUserId, clientId]);

  useEffect(() => {
    console.log(firstTimeLogin);
    const topicArr = getTopicArray();
    const getTok = getToken(setIsToken);

    Promise.all([topicArr, getTok]).then((res) => {
      console.log(res);
      const token = res[1];
      const topicArray = res[0];
      post({ topic_array: JSON.stringify(topicArray), token }, '/subscribeTokenToTopic')
        .then((resp) => {
          onMessageListener();
        })
        .catch((err) => console.log(err));
    });
  }, [getTopicArray, firstTimeLogin]);

  const partsOfDay = () => {
    const hours = new Date().getHours();

    if (hours >= 0 && hours < 12) setTime('Good Morning,');
    else if (hours >= 12 && hours <= 17) setTime('Good Afternoon,');
    else if (hours >= 17 && hours < 21) setTime('Good Evening,');
    else if (hours >= 21 && hours < 24) setTime('Good Evening,');
  };

  useEffect(() => {
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    if (comeBackFromTests) history.push('/questiontaker');
  }, [comeBackFromTests, history]);

  useEffect(() => {
    if (redirectPath) {
      history.push(redirectPath);
    }
  }, [redirectPath, history]);

  useEffect(() => {
    const roleId = roleArray.includes(4)
      ? 4
      : roleArray.includes(3)
      ? 3
      : roleArray.includes(2)
      ? 2
      : 1;

    setRole(roleId);
  }, [roleArray]);

  useEffect(() => {
    if (roleArray.includes(1) || roleArray.includes(2)) {
      const featArr = [...features];

      const payload = {
        client_user_id: clientUserId,
      };
      get(payload, '/getAllScheduledClassesForStudent').then((res) => {
        const result = apiValidation(res);
        console.log(result, 'getAllScheduledClassesForStudent');
        setStudentLiveStream(result);
      });
    }
  }, [roleArray, clientUserId]);

  useEffect(() => {
    partsOfDay();

    get({ client_user_id: clientUserId }, '/getRecentCourses').then((res) => {
      const result = apiValidation(res);
      setAllCourses(result.assigned_courses);
      setMyCourses(result.subscribed_courses);
      console.log(result, 'recentCourses');
    });
  }, [clientId, clientUserId, setDashboardDataToStore]);

  useEffect(() => {
    setHomeworkLanguageTypeToStore('');
    setSelectedCourseToStore('');
    setSelectedChapterToStore('');
    setSelectedTypeToStore('');
    setSelectedSubjectToStore('');
  }, []);

  useEffect(() => {
    const roleId = roleArray.includes(4)
      ? 4
      : roleArray.includes(3)
      ? 3
      : roleArray.includes(2)
      ? 2
      : 1;
    get(
      { client_id: clientId, role_id: roleId, client_user_id: clientUserId, is_new: true },
      '/getLoginPageInformation',
    ).then((res) => {
      console.log(res, 'sadad');
      const result = apiValidation(res);
      setNotices(result.notice);
      setClientStatus(result.client_status);
      setAdmissions(result.admission || {});
      setAttendance(result.attendance);
      setData(result);
      setHasLoaded(true);
      setGlobalMessageCountState(result.total_unread_message);
      setDashboardDataToStore(result);
      const sorterArr = [];

      for (const prop in result.feature) {
        if (Object.prototype.hasOwnProperty.call(result.feature, prop))
          sorterArr.push([result.feature[prop], result.feature[prop].order, prop]);
      }

      const finalArr = sorterArr
        .sort((a, b) => a[1] - b[1])
        .reduce((acc, curr) => {
          acc.push({ ...curr[0], switcher: curr[2] });
          return acc;
        }, []);
      console.log(finalArr, 'hello');
      setFeatures(finalArr);
      // const liveClassesFeature = finalArr.filter(
      //   (ele) => ele.client_feature_name === 'Live Classes',
      // )[0];
      // if (liveClassesFeature) {
      //   liveClassesFeature.isAddedByPriyam = true;
      //   const indexOfConnect = finalArr.findIndex(
      //     (ele) => ele.client_feature_name === 'Connect with us',
      //   );
      //   setFeatures(finalArr.splice(5, 0, liveClassesFeature));
      //   console.log(finalArr, 'hahahahahahhaaaa');
      //   setFeatures(finalArr);
      // }
    });
  }, [clientId, roleArray, setDashboardDataToStore]);

  const shareThis = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Come Join Us`,
          // eslint-disable-next-line
          text: `Hey, ${data.client_name} is a fast, simple and fun app that I use for learning and growing everyday`,
          url: window.location.href,
        })
        .then(() => {
          console.log('Thanks for sharing!');
        })
        .catch(console.error);
    } else {
      setShowToast(true);
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const goToLiveClasses = () => {
    const { push } = history;
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    push({ pathname: '/liveclasses' });
  };

  const goToNoticeBoard = () => {
    const { push } = history;
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    push({ pathname: '/noticeboard' });
  };

  const goToAdmissions = () => {
    const { push } = history;
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    push({ pathname: '/admissions' });
  };

  const goToStudyBin = () => {
    const { push } = history;
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    setFolderIdArrayToStore([]);
    push({ pathname: '/studybin' });
  };

  const goToProfile = () => {
    const { push } = history;
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    push({ pathname: '/profile' });
  };

  const goToFees = () => {
    const { push } = history;
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    push('fees');
  };

  const goToTeacherFees = () => {
    const { push } = history;
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    push('teacherfees');
  };

  const goToHomeWorkCreator = () => {
    const { push } = history;
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    push({ pathname: '/homework', state: { letsGo: true } });
  };

  const goToSentTests = (type) => {
    const { push } = history;
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    push({ pathname: '/homework/savedsent', state: { testsType: type } });
  };

  const goToChats = () => {
    const { push } = history;
    // if (clientStatus === 'deleted') {
    //   setRestrictionModal(true);
    //   return;
    // }
    push({ pathname: '/conversations' });
  };

  const startHomework = (responseArray, testId, languageType = 'english') => {
    const { push } = history;
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    setTestResultArrayToStore(responseArray);
    setTestIdToStore(testId);
    setTestLanguageToStore(languageType);
    setTestTypeToStore('homework');
    push('/questiontaker');
  };

  const startLiveTest = (
    responseArray,
    startTime = 0,
    endTime = 0,
    testType,
    testId,
    languageType = 'english',
  ) => {
    const { push } = history;
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    setTestResultArrayToStore(responseArray);
    setTestEndTimeToStore(endTime);
    // setTestStartTimeToStore(startTime);
    setTestStartTimeToStore(Math.round(new Date().getTime() / 1000));
    setTestTypeToStore(testType);
    setTestIdToStore(testId);
    setTestLanguageToStore(languageType);
    push('/questiontaker');
  };

  const goToCoursesForTeacher = () => {
    const { push } = history;
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    push({ pathname: '/courses/teachercourse' });
  };

  const goToCourses = (type) => {
    const { push } = history;
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    push({ pathname: '/courses', state: { type } });
  };

  const goToBuyCourse = (id) => {
    const { push } = history;
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    push(`/courses/buyCourse/${window.btoa(clientId)}/${window.btoa(id)}`);
  };

  const goToMyCourse = (id) => {
    const { push } = history;
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    setCourseIdToStore(id);
    push('/courses/mycourse');
  };

  const goToAddBatch = () => {
    const { push } = history;
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    push('/admissions/add/batch');
  };

  const addDetails = (type) => {
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    type === 'student'
      ? setAdmissionRoleArrayToStore(['1'])
      : type === 'teacher'
      ? setAdmissionRoleArrayToStore(['3'])
      : setAdmissionRoleArrayToStore(['4']);
    history.push({ pathname: '/admissions/add/details' });
  };

  const goToTeacherAnalysis = () => {
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    const { push } = history;
    push('/analysis/teacher');
  };

  const goToStudentAnalysis = () => {
    get({ client_user_id: clientUserId }, '/getOverallAnalysisOfStudent').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      result.first_name = firstName;
      result.last_name = lastName;
      result.isStudent = true;
      setAnalysisStudentObjectToStore(result);
      history.push('/analysis/studentlist');
    });
  };

  const gotToAttendance = () => {
    const { push } = history;
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    push('/attendance');
  };

  const goToDisplayPage = () => {
    const { push } = history;
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    push('/displaypage');
  };

  const goToCRM = () => {
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    history.push('/crm');
  };

  const goToVideos = () => {
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    history.push('/videos');
  };

  const goToOfflineAssignments = () => {
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    history.push('/offlineassignments');
  };

  const goToConversations = () => {
    // if (clientStatus === 'deleted') {
    //   setRestrictionModal(true);
    //   return;
    // }
    history.push('/conversations');
  };

  const dynamicCardClicked = (param) => {
    if (clientStatus === 'deleted') {
      setRestrictionModal(true);
      return;
    }
    if (param.in_app_redirect === 'true') {
      const page = param.redirct_feature;
      if (page === 'displayPage') {
        goToDisplayPage();
      } else if (page === 'courses') {
        role === 3 || role === 4 ? goToCoursesForTeacher() : goToCourses();
      } else if (page === 'chats') {
        goToChats();
      } else if (page === 'crm') {
        goToCRM();
      } else if (page === 'fees') {
        role === 3 || role === 4 ? goToTeacherFees() : goToFees();
      } else if (page === 'liveClasses') {
        goToLiveClasses();
      } else if (page === 'studyBin') {
        goToStudyBin();
      } else if (page === 'admission') {
        goToAdmissions();
      } else if (page === 'videos') {
        goToVideos();
      } else if (page === 'homeworkCreator') {
        goToHomeWorkCreator();
      } else if (page === 'analysis') {
        role === 3 || role === 4 ? goToTeacherAnalysis() : goToStudentAnalysis();
      } else if (page === 'attendance') {
        gotToAttendance();
      } else if (page === 'noticeBoard') {
        goToNoticeBoard();
      } else if (page === 'offlineAssignment') {
        goToOfflineAssignments();
      } else {
        console.log(page);
      }
    } else {
      window.open(param.redirect_url, '_blank');
    }
  };

  const renderComponents = (param) => {
    if (param.switcher.includes('dynamicCard')) {
      return roleArray.includes(3) || roleArray.includes(4) ? (
        <DynamicCards
          boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
          dynamicCardClicked={dynamicCardClicked}
          data={data[param.switcher]}
          titleData={data.feature[param.switcher]}
          noAddCard
          isDynamic
        />
      ) : null;
    }
    switch (param.switcher) {
      case 'attendance':
        return (
          <div
            className='Dashboard__attendance px-2 py-4'
            onClick={() => gotToAttendance()}
            onKeyDown={() => gotToAttendance()}
            tabIndex='-1'
            role='button'
          >
            <div className='Dashboard__attendanceCard mx-auto pt-4'>
              <img
                src={param.feature_icon}
                alt='hands'
                className='mx-auto d-block Dashboard__attendanceLogo'
              />
              <Row className='m-3'>
                <span className='Dashboard__todaysHitsText my-auto'>
                  {param.client_feature_name}
                </span>
                <span className='ml-auto'>
                  <ChevronRightIcon />
                </span>
              </Row>

              <p className='Dashboard__attendanceSubHeading mx-3 pb-2'>{param.description}</p>

              {attendance.length > 0 && (
                <div>
                  <hr />
                  <div>
                    <p className='Dashboard__attendanceRecents mx-3'>Recent Attendance</p>
                    <Row className='mx-2'>
                      {attendance.map((elem) => {
                        return (
                          <div className='d-flex flex-column mx-2' key={elem.batch_id}>
                            <img
                              src={userAvatar}
                              alt='batch'
                              height='35px'
                              width='35px'
                              className='Dashboard__noticeImage d-block mx-auto'
                            />
                            <p className='Dashboard__attendanceRecents text-center mt-1'>
                              {elem.batch_name}
                            </p>
                          </div>
                        );
                      })}
                    </Row>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'noticeBoard':
        return (
          <div
            className='Dashboard__noticeBoard mx-auto p-lg-3 p-2 mb-3'
            onClick={() => goToNoticeBoard()}
            role='button'
            tabIndex='-1'
            style={{ backgroundColor: '#fffef4' }} // hardcoded by Aakash sir
            onKeyDown={() => goToNoticeBoard()}
          >
            <span className='Dashboard__verticalDots'>
              <MoreVertIcon />
            </span>
            <Row className='mt-2'>
              <Col xs={8} className='pl-4'>
                <p className='Dashboard__todaysHitsText'>{param.client_feature_name}</p>
                {(roleArray.includes(3) || roleArray.includes(4)) && (
                  <Button style={{ backgroundColor: 'white' }} variant='noticeBoardPost'>
                    <BorderColorIcon />
                    <span className='m-2'>Write a post</span>
                  </Button>
                )}
                {(roleArray.includes(1) || roleArray.includes(2)) && (
                  <p className='Dashboard__attendanceSubHeading'>{param.description}</p>
                )}
              </Col>
              <Col xs={4} className='noticeboard_img'>
                <img src={param.feature_icon} alt='notice' className='Dashboard__NoticeIcon' />
              </Col>
            </Row>

            <Row className='mt-5 mx-2 mb-3'>
              <span className='Dashboard__noticeBoardText my-auto'>Latest Notices</span>
              <span className='ml-auto' style={{ color: 'rgba(117, 117, 117, 1)' }}>
                <ChevronRightIcon />
              </span>
            </Row>

            {notices.map((elem) => (
              <div key={`elem${elem.notice_id}`} className='Dashboard__notice'>
                <Row>
                  <Col xs={3} className='p-lg-4 py-3 text-center pr-0'>
                    <img
                      src={elem.profile_image ? elem.profile_image : userAvatar}
                      alt='profile'
                      className='Dashboard__noticeImage d-block mx-auto'
                    />
                  </Col>
                  <Col xs={9} className='pt-lg-4 py-3 pl-0 my-auto'>
                    <p className='Dashboard__scrollableCardHeading m-0'>
                      {`${elem.first_name} ${elem.last_name}`}
                    </p>
                    <p className='Dashboard__noticeSubHeading mb-0'>
                      {format(fromUnixTime(elem.time_of_notice), 'hh:m bbbb, do MMM yyy')}
                    </p>
                  </Col>
                </Row>
                <p style={{ backgroundColor: '#fff4a4' }} className='p-2 Dashboard__noticeText'>
                  {elem.notice_text}
                </p>
              </div>
            ))}
          </div>
        );
      case 'homeworkCreator':
        return (
          <div
            style={{
              background: `linear-gradient(90deg, ${param.end_colour}, ${param.start_colour})`,
            }}
            className='Dashboard__innovation pt-4 pl-3 pr-0 pb-3 mx-auto'
          >
            <div>
              <p className='Dashboard__innovationpBlack ml-2'>
                Assignment Creator
                <ChevronRightIcon />
              </p>
              <h4 className='Dashboard__innovationh4 ml-2'>Witness </h4>
              <h4 className='Dashboard__innovationh4 ml-2'>
                The <span className='Dashboard__innovationh4span'>innovation</span>
              </h4>
              <p className='mr-5 Dashboard__innovationp ml-2'>
                Create tests &amp; home-works in 4 simple steps
              </p>
              <Button
                className='Dashboard_homeworkCreator btnLetsGo ml-2'
                variant='dashboardHWletsGo'
                onClick={() => goToHomeWorkCreator()}
              >
                Let&apos;s go
                <span>
                  <ChevronRightIcon />
                </span>
              </Button>
            </div>
            <div className='Dashboard__assignment my-4 mr-2 Dashboard_homeworkCreator'>
              <section className='Dashboard__scrollableCard HWCdisplay'>
                <div className='HWscrollableCard'>
                  <Row>
                    <Col xs={8} className='pr-0' onClick={() => goToSentTests('sent')}>
                      <p className='Dashboard__scrollableCardHeading pt-2 pl-3 mb-0'>
                        Sent assignments
                      </p>
                      <p className='Dashboard__scrollableCardText pl-3 mt-1'>
                        All the tests &amp; homeworks sent to students are here...
                      </p>
                    </Col>
                    <Col xs={4} className='pt-3'>
                      <img
                        src={param.feature_icon}
                        alt='assignment'
                        className='savedSentCardImage'
                      />
                    </Col>
                  </Row>
                </div>
                <div className='HWscrollableCard2'>
                  <Row>
                    <Col xs={8} className='pr-0' onClick={() => goToSentTests('saved')}>
                      <p className='Dashboard__scrollableCardHeading pt-2 pl-3 mb-0'>
                        Saved assignments
                      </p>
                      <p className='Dashboard__scrollableCardText pl-3 mt-1'>
                        See all your saved tests &amp; homeworks here...
                      </p>
                    </Col>
                    <Col xs={4} className='pt-3'>
                      <img
                        src={param.feature_icon}
                        alt='assignment'
                        className='savedSentCardImage'
                      />
                    </Col>
                  </Row>
                </div>
              </section>
            </div>
          </div>
        );
      case 'analysis':
        return (
          <DashboardCards
            image={param.feature_icon} // analysisHands
            width={62}
            height={78}
            heading={param.client_feature_name}
            subHeading={param.description}
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            backGround={param.start_colour}
            backgroundImg={`linear-gradient(90deg, ${param.start_colour} 0%, ${param.end_colour} 100%)`}
            buttonClick={role === 1 || role === 2 ? goToStudentAnalysis : goToTeacherAnalysis}
            textColor={data.text_color}
          />
        );
      case 'offlineAssignment':
        return (
          <DashboardCards
            image={param.feature_icon} // analysisHands
            width={62}
            height={78}
            heading={param.client_feature_name}
            subHeading={param.description}
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            backGround={param.start_colour}
            backgroundImg={`linear-gradient(90deg, ${param.start_colour} 0%, ${param.end_colour} 100%)`}
            buttonClick={goToOfflineAssignments}
            textColor={data.text_color}
          />
        );
      case 'fees':
        return (
          <DashboardCards
            image={param.feature_icon}
            width={53}
            height={78}
            heading={param.client_feature_name}
            subHeading={param.description}
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            backGround={param.start_colour}
            backgroundImg={`linear-gradient(90deg, ${param.start_colour} 0%, ${param.end_colour} 100%)`}
            buttonClick={role === 1 || role === 2 ? goToFees : goToTeacherFees}
            textColor={data.text_color}
          />
        );
      case 'videos':
        return (
          <>
            <DashboardCards
              image={param.feature_icon}
              width={53}
              height={78}
              heading={param.client_feature_name}
              subHeading={param.description}
              boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
              backGround={param.start_colour}
              backgroundImg={`linear-gradient(90deg, ${param.start_colour} 0%, ${param.end_colour} 100%)`}
              buttonClick={goToVideos}
              textColor={data.text_color}
              uploadVideoText={`${
                roleArray.includes(3) || roleArray.includes(4) ? 'Upload a video' : ''
              }`}
              uploadVideoClicked={(e) => {
                e.stopPropagation();
                if (clientStatus === 'deleted') {
                  setRestrictionModal(true);
                  return;
                }
                history.push({ pathname: '/addyoutubevideo', state: { addVideo: true } });
              }}
            />
          </>
        );
      case 'posters':
        return data.posters.length > 0 ? (
          <div className='my-2 mt-4'>
            <AspectCards
              data={data.posters}
              clickCard={() => {}}
              clickAddCard={() => {}}
              section='notice'
              noAddCard
              bigAspectCard
            />
          </div>
        ) : null;
      case 'starPerformers':
        return data.star_performers.length > 0 ? (
          <>
            <h6
              style={{
                fontFamily: 'Montserrat-Bold',
                lineHeight: '20px',
                textAlign: 'left',
                fontSize: '16px',
              }}
              className='mx-auto ml-3 mt-4 mb-0 scrollableCardHeading'
            >
              {param.client_feature_name}
            </h6>
            <AspectCards
              data={data.star_performers}
              clickCard={() => {}}
              clickAddCard={() => {}}
              section='notice'
              noAddCard
            />
          </>
        ) : null;
      case 'testimonial':
        return data.testimonials.length > 0 ? (
          <>
            <h6
              style={{
                fontFamily: 'Montserrat-Bold',
                lineHeight: '20px',
                textAlign: 'left',
                fontSize: '16px',
              }}
              className='mx-auto ml-3 mt-4 mb-0 scrollableCardHeading'
            >
              {param.client_feature_name}
            </h6>
            <AspectCards
              data={data.testimonials}
              clickCard={() => {}}
              clickAddCard={() => {}}
              section='notice'
              noAddCard
            />
          </>
        ) : null;
      case 'aboutUs':
        return (
          <div className='text-left my-3 mt-5 aboutConnectContainer'>
            <h5 className='Dummy__aboutus'>{param.client_feature_name}</h5>
            <p className='Dummy__aboutData'>{data.about_us}</p>

            <h5 className='Dummy__aboutus'>Connect with us</h5>

            <section className='Scrollable__card ' style={{ minHeight: '40px' }}>
              {[
                {
                  key: 1,
                  name: 'insta',
                  link: data.instagram_link,
                  image: insta,
                },

                { key: 2, name: 'fb', link: data.facebook_link, image: fb },
                {
                  key: 3,
                  name: 'watsapp',
                  link: data.whatsapp_link,
                  image: whatsapp,
                },
                {
                  key: 4,
                  name: 'you',
                  link: data.youtube_link,
                  image: youtube,
                },
                {
                  key: 5,
                  name: 'tele',
                  link: data.telegram_link,
                  image: telegram,
                },
                {
                  key: 6,
                  name: 'linked',
                  link: data.linkedin_link,
                  image: linkedin,
                },
              ]
                .filter((e) => e.link)
                .map((elem) => {
                  return (
                    <a href={elem.link} className='text-center mr-4 my-3 ml-0' key={elem.key}>
                      <img src={elem.image} alt={elem.link} className='Dummy__socialLinks' />
                    </a>
                  );
                })}
              <a
                href={data.other_link}
                className='text-center mr-3 my-3 ml-0'
                style={{
                  backgroundColor: 'rgba(112, 112, 112, 1)',
                  color: '#fff',
                  height: '36px',
                  width: '36px',
                  borderRadius: '36px',
                  padding: '4px',
                }}
                key={7}
              >
                <LinkIcon />
              </a>
            </section>
          </div>
        );
      case 'courses':
        return role === 1 || role === 2 ? (
          <CoursesCards
            allCourses={allCourses}
            myCourses={myCourses}
            goToCourse={goToCourses}
            buyCourseId={goToBuyCourse}
            myCourseId={goToMyCourse}
            clientLogo={branding.branding.client_logo}
          />
        ) : (
          <DashboardCards
            image={param.feature_icon}
            width={51}
            height={78}
            heading={param.client_feature_name}
            subHeading={param.description}
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            backgroundImg={`linear-gradient(90deg, ${param.start_colour} 0%, ${param.end_colour} 100%)`}
            backGround={param.start_colour}
            buttonClick={goToCoursesForTeacher}
            textColor={data.text_color}
          />
        );
      case 'liveClasses':
        return role === 3 || role === 4 ? (
          <DashboardCards
            image={param.feature_icon}
            width={91}
            height={73}
            heading={param.client_feature_name}
            subHeading={param.description}
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            backGround={param.start_colour}
            backgroundImg={`linear-gradient(90deg, ${param.start_colour} 0%, ${param.end_colour} 100%)`}
            buttonText={roleArray.includes(3) || roleArray.includes(4) ? 'Go live now' : ''}
            buttonClick={goToLiveClasses}
            textColor={data.text_color}
          />
        ) : (
          <>
            <LiveClassesCards
              firstName={firstName}
              lastName={lastName}
              liveClasses={studentLiveStream.slice(0, 4)}
              history={history}
            />
          </>
        );
      case 'onlineAssignment':
        return (
          <div>
            {clientStatus !== 'deleted' ? (
              <Tests startHomework={startHomework} startLive={startLiveTest} />
            ) : null}
          </div>
        );
      case 'studyBin':
        return (
          <DashboardCards
            image={param.feature_icon} // student
            width={56}
            height={86}
            heading={param.client_feature_name}
            color='rgba(0, 102, 255, 0.87)'
            backgroundImg={`linear-gradient(90deg, ${param.start_colour} 0%, ${param.end_colour} 100%)`}
            subHeading={param.description}
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            buttonClick={goToStudyBin}
            textColor={data.text_color}
          />
        );
      case 'admissionForm':
        return (
          <Card
            className='DashboardCards'
            style={{
              border: '1px solid rgba(112,112,112,0.5)',
              margin: 'auto',
              backgroundColor: '#F7FDFF',
            }}
          >
            <Row className='mx-0 justify-content-center mt-2'>
              <Col xs={8} className='text-left p-3'>
                <h6 className='Dummy__joinUs'>{param.client_feature_name}</h6>
                <p className='mb-0 mt-3 Dummy__joinDetails'>Your are not in any batch yet</p>
                <p className='Dummy__joinSmall mt-1'>Fill admission form to join us.</p>
              </Col>
              <Col xs={4} className='p-2' style={{ textAlign: 'right' }}>
                {/* form */}
                <img
                  src={param.feature_icon}
                  alt='form'
                  // style={{ width: '100px' }}
                  className='Dashboard_image shareImage'
                />
              </Col>
            </Row>
            <div className='Dashboard__admissionButtonContainer'>
              {data.admission_form_filled !== 'true' ? (
                <Button
                  variant='customPrimarySmol'
                  className='mb-3 fillAdmissionFormButton'
                  onClick={() => {
                    if (clientStatus === 'deleted') {
                      setRestrictionModal(true);
                      return;
                    }
                    history.push('/admissionform');
                  }}
                >
                  Fill admission form
                </Button>
              ) : (
                <p
                  // style={{ textAlign: 'center' }}
                  className='Dashboard__attendanceSubHeading mb-3 text-center'
                >
                  You have already filled the admission form!
                </p>
              )}
            </div>
          </Card>
        );
      case 'share':
        return (
          <Card
            className='DashboardCards mb-2 mt-4'
            style={{ border: '1px solid rgba(112, 112, 112, 0.5)', margin: 'auto' }}
          >
            <Row className='mx-0 justify-content-center mt-2'>
              <Col xs={7} className='text-left p-3'>
                <h6 className='Dummy__joinUs'>{param.client_feature_name}</h6>
                <p className='mb-0 Dummy__joinDetails'>Enjoying the application?</p>
                <p className='Dummy__joinSmall mt-1'>Share with your friends</p>
                <Button
                  variant='customPrimarySmol'
                  className='mb-3 shareBtn'
                  style={{ padding: '10px 20px' }}
                  onClick={() => shareThis()}
                >
                  Share
                </Button>
              </Col>
              <Col xs={5} className='p-3' style={{ textAlign: 'right' }}>
                {/* share */}
                <img
                  src={param.feature_icon}
                  alt='form'
                  style={{ width: '100px' }}
                  className='Dashboard_image shareImage'
                />
              </Col>
            </Row>
          </Card>
        );
      case 'contactUs':
        return (
          <Card
            className='DashboardCards mt-3 mb-2'
            style={{
              border: '0.5px solid rgba(112, 112, 112, 0.5)',
              margin: 'auto',
              backgroundColor: '#EDEDED',
            }}
          >
            <Row className='mx-3 justify-content-left mt-2'>
              <h6 style={{ fontSize: '16px' }} className='Dummy__joinUs'>
                {param.client_feature_name}
              </h6>
            </Row>
            {data.address.location && (
              <Row className='mx-0 justify-content-center mt-2'>
                <Col xs={2} sm={1} className='pr-0'>
                  <LocationOnIcon className='contactIcons' />
                </Col>
                <Col xs={10} sm={11} className='text-left p-0 my-auto pr-4'>
                  <p className='mb-0 Dummy__contactDetails'>{data.address.location}</p>
                  <p className='Dummy__contactSmall'>Address</p>
                </Col>
              </Row>
            )}

            {data.address.client_contact && (
              <Row className='mx-0 justify-content-center mt-2'>
                <Col xs={2} sm={1} className='pr-0'>
                  <PhoneIcon className='contactIcons' />
                </Col>
                <Col xs={10} sm={11} className='text-left p-0 my-auto pr-4'>
                  <p className='mb-0 Dummy__contactDetails'>{data.address.client_contact}</p>
                  <p className='Dummy__contactSmall'>Phone</p>
                </Col>
              </Row>
            )}
            {data.address.client_email && (
              <Row className='mx-0 justify-content-center mt-2'>
                <Col xs={2} sm={1} className='pr-0'>
                  <AlternateEmailIcon className='contactIcons' />
                </Col>
                <Col xs={10} sm={11} className='text-left p-0 my-auto pr-4'>
                  <p className='mb-0 Dummy__contactDetails'>{data.address.client_email}</p>
                  <p className='Dummy__contactSmall'>Email</p>
                </Col>
              </Row>
            )}
          </Card>
        );
      case 'crm':
        return (
          <DashboardCards
            image={param.feature_icon} // analysis
            width={76}
            height={84}
            heading={param.client_feature_name}
            subHeading={param.description}
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            backgroundImg={`linear-gradient(90deg, ${param.start_colour} 0%, ${param.end_colour} 100%)`}
            backGround={param.start_colour}
            textColor={data.text_color}
            buttonClick={goToCRM}
          />
        );
      case 'admission':
        return (
          Object.keys(admissions).length > 0 && (
            <>
              {(
                <DashBoardAdmissions
                  admissions={admissions}
                  goToAddBatch={goToAddBatch}
                  goToAdmissions={goToAdmissions}
                  openOptionsModal={openOptionsModal}
                  heroImage={param.feature_icon}
                />
              ) || <Skeleton count={20} />}
            </>
          )
        );
      case 'displayPage':
        return (
          <DashboardCards
            image={param.feature_icon} // student
            width={78}
            height={76}
            heading={param.client_feature_name}
            color='rgba(255, 236, 222, 1)'
            subHeading={param.description}
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            backgroundImg={`linear-gradient(90deg, ${param.start_colour} 0%, ${param.end_colour} 100%)`}
            buttonClick={goToDisplayPage}
            textColor={data.text_color}
          />
        );
      case 'chats':
        return role === 3 || role === 4 ? (
          <DashboardCards
            image={param.feature_icon}
            heading={param.client_feature_name}
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            subHeading={param.description}
            backgroundImg={`linear-gradient(90deg, ${param.start_colour} 0%, ${param.end_colour} 100%)`}
            backGround={param.start_colour}
            buttonClick={goToChats}
            textColor={data.text_color}
          />
        ) : (
          <>
            <button type='button' onClick={goToChats} className='floatingChatButtonDashboard'>
              Let&apos;s Chat
            </button>
            {globalMessageCountState > 0 ? (
              <div className='dotOnFloatingButton'>{globalMessageCountState}</div>
            ) : null}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className='Dashboard__mainContainerDiv'>
      <div
        className='Dashboard__headerCard pb-3'
        // className={`Dashboard__headerCard pb-3 ${
        //   roleArray.includes(1) || roleArray.includes(2) ? 'mb-4' : 'mb-0'
        // }`}
      >
        <Row className='pt-4 pr-4'>
          <span className='ml-auto p-3'>{/* <MoreVertIcon /> */}</span>
        </Row>
        {hasLoaded && (
          <h3 style={{ color: data.app_name_color }} className='Dummy__coachingName text-center'>
            {data.client_name}
          </h3>
        )}
        {hasLoaded && (
          <p
            style={{ color: data.app_name_color }}
            className='Dummy__tagline mb-4 text-center mb-5'
          >
            {data.client_tag_line}
          </p>
        )}

        {/* <GlobalSearchBar
          style={{
            height: `${nameDisplay ? '100%' : '0px'}`,
            opacity: `${nameDisplay ? 1 : 0}`,
            // display: `${nameDisplay ? 'flex' : 'none'}`,
          }}
        /> */}

        <Row
          style={{
            height: `${nameDisplay ? '100%' : '0px'}`,
            opacity: `${nameDisplay ? 1 : 0}`,
            // display: `${nameDisplay ? 'flex' : 'none'}`,
          }}
          className=''
          className='nameAndProfilePic mx-auto px-2 mt-4'
        >
          <Col
            xs={4}
            md={roleArray.includes(1) || roleArray.includes(2) ? 1 : 2}
            onClick={() => goToProfile()}
          >
            <img
              src={profileImage || userAvatar}
              className='Dashboard__profileImage float-right img-responsive'
              alt='profile'
            />
          </Col>
          <Col
            className='zeroPaddingOnMobile'
            xs={8}
            md={roleArray.includes(1) || roleArray.includes(2) ? 11 : 10}
          >
            <h4 className='Dashboard__headingText '>
              {time} {firstName}
            </h4>
            {/* <h4 className='Dashboard__headingText'></h4> */}
          </Col>
        </Row>
        <Row
          style={{
            display: `${nameDisplay ? 'none' : 'block'}`,
          }}
          className='dashboardLogoImage'
        >
          <Col className='mx-auto'>
            <img
              src={branding.branding.client_logo}
              alt='profile'
              className='clientLogoDashboard'
              // style={{ width: '80px', height: '80px' }}
            />
          </Col>
        </Row>

        {/* <div className='Dashboard__todaysHits mx-auto my-4'>
          <Row className='mx-3 pt-2'>
            <span className='Dashboard__todaysHitsText'>Today&apos;s hit for you</span>
            <span className='ml-auto'>
              <MoreVertIcon />
            </span>
          </Row>
        </div> */}
      </div>

      {hasLoaded &&
        features.length > 0 &&
        features
          .filter((elem) => process.env.NODE_ENV === 'development' || elem.status === 'active')
          .map((elem) => renderComponents(elem))}

      {/* <DashboardCards
        image={offlineAssignment} // student
        heading='Chats'
        color='rgba(255, 236, 222, 1)'
        subHeading='Talk to other people here.'
        boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
        backgroundImg='linear-gradient(90deg, rgba(236,255,252,1) 0%, rgba(8,203,176,1) 100%)'
        backGround='rgb(236,255,252)'
        buttonClick={goToConversations}
      /> */}

      <Modal show={optionsModal} onHide={closeOptionsModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='mx-0 justify-content-between'>
            <Button
              variant='noticeBoardPost'
              style={{ paddingRight: '10px', paddingLeft: '10px' }}
              onClick={() => addDetails('student')}
            >
              <PersonAddIcon />
              <span>Student</span>
            </Button>
            <Button
              variant='noticeBoardPost'
              style={{ paddingRight: '10px', paddingLeft: '10px' }}
              onClick={() => {
                addDetails('teacher');
              }}
            >
              <PersonAddIcon />
              <span className=''>Teacher</span>
            </Button>

            <Button
              style={{ paddingRight: '10px', paddingLeft: '10px' }}
              variant='noticeBoardPost'
              onClick={() => {
                addDetails('admin');
              }}
            >
              <PersonAddIcon />
              <span className=''>Admin</span>
            </Button>
          </Row>
        </Modal.Body>
      </Modal>
      <Modal show={restrictionModal} onHide={() => setRestrictionModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Features Inaccessible?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='connectWithUsText'>
            Services may be suspended due to non-renewal of subscription. Please contact your
            institute for uninterrupted services on your web app.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={goToChats} variant='boldText'>
            Meanwhile, interact with your friends!
          </Button>
        </Modal.Footer>
      </Modal>
      <Toast
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '15%',
          zIndex: '999',
        }}
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
      >
        <Toast.Header>
          <strong className='mr-auto'>Copied!</strong>
          <small>Just Now</small>
        </Toast.Header>
        <Toast.Body>The link has been copied to your clipboard!</Toast.Body>
      </Toast>
      <Toast
        style={{
          position: 'fixed',
          top: '20px',
          right: '15%',
          zIndex: '999',
        }}
        onClose={() => setIsToken(true)}
        show={!isToken}
        delay={5000}
        autohide
      >
        <Toast.Header>
          <strong className='mr-auto'>Notifications</strong>
          <small>Just Now</small>
        </Toast.Header>
        <Toast.Body>
          Please allow notifications to receive prompt updates and important notifications
        </Toast.Body>
      </Toast>
      {hasLoaded && roleArray.includes(4) ? (
        <p className='connectWithUsText'>
          Have an issue?{' '}
          <a className='connectText' href='tel:+918826286002'>
            Connect
          </a>{' '}
          with us!
        </p>
      ) : null}
      {hasLoaded && (
        <footer style={{ paddingBottom: '1rem' }} className='py-2 Dashboard__footer mb-3'>
          <h6 className='Dashboard__footerText'>Powered By</h6>
          <img
            // style={{ minWidth: '33%' }}
            src={footerIngenium}
            alt='footerLogo'
            className='deskWidth'
          />
        </footer>
      )}
      <BottomNavigation history={history} activeNav='home' />
    </div>
  );
};

const mapStateToProps = (state) => ({
  userProfile: getUserProfile(state),
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  roleArray: getRoleArray(state),
  branding: getCurrentBranding(state),
  comeBackFromTests: getComeBackFromTests(state),
  redirectPath: getCurrentRedirectPath(state),
  firstTimeLogin: getFirstTimeLoginState(state),
  socket: getSocket(state),
});

const mapDispatchToProps = (dispatch) => ({
  clearClientIdDetails: () => {
    dispatch(clientUserIdActions.clearClientIdDetails());
  },
  setSocket: (socket) => {
    dispatch(conversationsActions.setSocket(socket));
  },
  clearProfile: () => {
    dispatch(userProfileActions.clearUserProfile());
  },
  setFirstTimeLoginToStore: () => {
    dispatch(firstTimeLoginActions.setFirstTimeLoginToStore());
  },
  setTestIdToStore: (payload) => {
    dispatch(testsActions.setTestIdToStore(payload));
  },
  setTestTypeToStore: (payload) => {
    dispatch(testsActions.setTestTypeToStore(payload));
  },
  setTestStartTimeToStore: (payload) => {
    dispatch(testsActions.setTestStartTimeToStore(payload));
  },
  setTestEndTimeToStore: (payload) => {
    dispatch(testsActions.setTestEndTimeToStore(payload));
  },
  setTestResultArrayToStore: (payload) => {
    dispatch(testsActions.setTestResultArrayToStore(payload));
  },
  setTestLanguageToStore: (payload) => {
    dispatch(testsActions.setTestLanguageToStore(payload));
  },
  setCourseIdToStore: (payload) => {
    dispatch(courseActions.setCourseIdToStore(payload));
  },
  setAdmissionRoleArrayToStore: (payload) => {
    dispatch(admissionActions.setAdmissionRoleArrayToStore(payload));
  },
  setHomeworkLanguageTypeToStore: (payload) => {
    dispatch(homeworkActions.setHomeworkLanguageTypeToStore(payload));
  },
  setFolderIdArrayToStore: (payload) => {
    dispatch(studyBinActions.setFolderIDArrayToStore(payload));
  },
  setDashboardDataToStore: (payload) => {
    dispatch(dashboardActions.setDashboardDataToStore(payload));
  },
  setAnalysisStudentObjectToStore: (payload) => {
    dispatch(analysisActions.setAnalysisStudentObjectToStore(payload));
  },
  setSelectedCourseToStore: (payload) => {
    dispatch(homeworkActions.setSelectedCourseToStore(payload));
  },
  setSelectedSubjectToStore: (payload) => {
    dispatch(homeworkActions.setSelectedSubjectToStore(payload));
  },
  setSelectedChapterToStore: (payload) => {
    dispatch(homeworkActions.setSelectedChapterToStore(payload));
  },
  setSelectedTypeToStore: (payload) => {
    dispatch(homeworkActions.setSelectedTypeToStore(payload));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

Dashboard.propTypes = {
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  clearProfile: PropTypes.func.isRequired,
  clearClientIdDetails: PropTypes.func.isRequired,
  setTestResultArrayToStore: PropTypes.func.isRequired,
  setTestEndTimeToStore: PropTypes.func.isRequired,
  setTestStartTimeToStore: PropTypes.func.isRequired,
  setTestIdToStore: PropTypes.func.isRequired,
  setFirstTimeLoginToStore: PropTypes.func.isRequired,
  setTestTypeToStore: PropTypes.func.isRequired,
  setHomeworkLanguageTypeToStore: PropTypes.func.isRequired,
  setTestLanguageToStore: PropTypes.func.isRequired,
  setCourseIdToStore: PropTypes.func.isRequired,
  setDashboardDataToStore: PropTypes.func.isRequired,
  setAdmissionRoleArrayToStore: PropTypes.func.isRequired,
  setAnalysisStudentObjectToStore: PropTypes.func.isRequired,
  setFolderIdArrayToStore: PropTypes.func.isRequired,
  userProfile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    profileImage: PropTypes.string,
  }).isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  branding: PropTypes.instanceOf(Object).isRequired,
  comeBackFromTests: PropTypes.bool.isRequired,
  redirectPath: PropTypes.string.isRequired,
  setSocket: PropTypes.func.isRequired,
  firstTimeLogin: PropTypes.bool.isRequired,
  socket: PropTypes.instanceOf(Object).isRequired,
  setSelectedCourseToStore: PropTypes.func.isRequired,
  setSelectedChapterToStore: PropTypes.func.isRequired,
  setSelectedTypeToStore: PropTypes.func.isRequired,
  setSelectedSubjectToStore: PropTypes.func.isRequired,
};
