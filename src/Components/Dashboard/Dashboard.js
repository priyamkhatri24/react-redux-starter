import React, { useState, useEffect, useCallback } from 'react';
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
import { connect } from 'react-redux';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import Toast from 'react-bootstrap/Toast';
import { getUserProfile } from '../../redux/reducers/userProfile.reducer';
import { get, apiValidation, prodOrDev, post } from '../../Utilities';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import userAvatar from '../../assets/images/user.svg';
import { userProfileActions } from '../../redux/actions/userProfile.action';
import { clientUserIdActions } from '../../redux/actions/clientUserId.action';
import { testsActions } from '../../redux/actions/tests.action';
import { courseActions } from '../../redux/actions/course.action';
import { AspectCards, CoursesCards, DashboardCards } from '../Common';
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
import fb from '../../assets/images/dummyDashboard/fb.png';
import linkedin from '../../assets/images/dummyDashboard/linkedin.svg';
import insta from '../../assets/images/dummyDashboard/instagram.svg';
import whatsapp from '../../assets/images/dummyDashboard/whatsapp.svg';
import youtube from '../../assets/images/dummyDashboard/youtube.png';
import telegram from '../../assets/images/dummyDashboard/telegram.svg';
import '../Login/DummyDashboard.scss';
import { dashboardActions } from '../../redux/actions/dashboard.action';
import { analysisActions } from '../../redux/actions/analysis.action';
import { getCurrentRedirectPath } from '../../redux/reducers/dashboard.reducer';
import { getToken, onMessageListener } from '../../Utilities/firebase';

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
    setTestIdToStore,
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
  } = props;
  const [time, setTime] = useState('');
  const [notices, setNotices] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [role, setRole] = useState(1);
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [admissions, setAdmissions] = useState({});
  const [data, setData] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [optionsModal, setOptionsModal] = useState(false);
  const openOptionsModal = () => setOptionsModal(true);
  const closeOptionsModal = () => setOptionsModal(false);
  const [features, setFeatures] = useState([]);
  const [isToken, setIsToken] = useState(true);
  const [nameDisplay, setNameDisplay] = useState(false);

  // const nameDisplayTimer = setTimeout(() => {
  //   setNameDisplayCounter(nameDisplayCounter + 1);
  //   if (nameDisplayCounter >= 3) {
  //     clearTimeout(nameDisplayTimer);
  //   }
  //   console.log('timer');
  // }, 1000);
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
          const topicArr = result.map((e) => `${currEnv}batch${e.client_batch_id}`);
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
      post({ topic_array: JSON.stringify(topicArray), token }, '/subscribeTokenToTopic').then(
        (resp) => {
          onMessageListener();
        },
      );
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
    partsOfDay();

    get({ client_user_id: clientUserId }, '/getRecentCourses').then((res) => {
      const result = apiValidation(res);
      setAllCourses(result.assigned_courses);
      setMyCourses(result.subscribed_courses);
      console.log(result);
    });
  }, [clientId, clientUserId, setDashboardDataToStore]);

  useEffect(() => {
    const roleId = roleArray.includes(4)
      ? 4
      : roleArray.includes(3)
      ? 3
      : roleArray.includes(2)
      ? 2
      : 1;
    get({ client_id: clientId, role_id: roleId }, '/getLoginPageInformation').then((res) => {
      console.log(res, 'sadad');
      const result = apiValidation(res);
      setNotices(result.notice);
      setAdmissions(result.admission || {});
      setAttendance(result.attendance);
      setData(result);
      setHasLoaded(true);
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
    push({ pathname: '/liveclasses' });
  };

  const goToNoticeBoard = () => {
    const { push } = history;
    push({ pathname: '/noticeboard' });
  };

  const goToAdmissions = () => {
    const { push } = history;
    push({ pathname: '/admissions' });
  };

  const goToStudyBin = () => {
    const { push } = history;
    setFolderIdArrayToStore([]);
    push({ pathname: '/studybin' });
  };

  const goToProfile = () => {
    const { push } = history;
    push({ pathname: '/profile' });
  };

  const goToFees = () => {
    const { push } = history;
    push('fees');
  };

  const goToTeacherFees = () => {
    const { push } = history;
    push('teacherfees');
  };

  const goToHomeWorkCreator = () => {
    const { push } = history;
    push({ pathname: '/homework', state: { letsGo: true } });
  };

  const goToSentTests = (type) => {
    const { push } = history;
    push({ pathname: '/homework/savedsent', state: { testsType: type } });
  };

  const goToChats = () => {
    const { push } = history;
    push({ pathname: '/conversations' });
  };

  const startHomework = (responseArray, testId, languageType = 'english') => {
    const { push } = history;
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
    push({ pathname: '/courses/teachercourse' });
  };

  const goToCourses = (type) => {
    const { push } = history;
    push({ pathname: '/courses', state: { type } });
  };

  const goToBuyCourse = (id) => {
    const { push } = history;

    push(`/courses/buyCourse/${clientId}/${id}`);
  };

  const goToMyCourse = (id) => {
    const { push } = history;
    setCourseIdToStore(id);
    push('/courses/mycourse');
  };

  const goToAddBatch = () => {
    const { push } = history;
    push('/admissions/add/batch');
  };

  const addDetails = (type) => {
    type === 'student'
      ? setAdmissionRoleArrayToStore(['1'])
      : type === 'teacher'
      ? setAdmissionRoleArrayToStore(['3'])
      : setAdmissionRoleArrayToStore(['4']);
    history.push({ pathname: '/admissions/add/details' });
  };

  const goToTeacherAnalysis = () => {
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
    push('/attendance');
  };

  const goToDisplayPage = () => {
    const { push } = history;
    push('/displaypage');
  };

  const goToCRM = () => history.push('/crm');

  const goToConversations = () => history.push('/conversations');

  const renderComponents = (param) => {
    switch (param.switcher) {
      case 'attendance':
        return (
          <div
            className='Dashboard__attendance p-4'
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
                <span className='Dashboard__todaysHitsText my-auto'>Attendance</span>
                <span className='ml-auto'>
                  <ChevronRightIcon />
                </span>
              </Row>

              <p className='Dashboard__attendanceSubHeading mx-3 pb-2'>
                Record attendance of the students and notify parents via SMS daily.
              </p>

              {attendance.length > 0 && (
                <div>
                  <hr />
                  <div>
                    <p className='Dashboard__attendanceRecents ml-1'>Recent Attendance</p>
                    <Row className='mx-2'>
                      {attendance.map((elem) => {
                        return (
                          <div className='d-flex flex-column mx-1' key={elem.batch_id}>
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
            onKeyDown={() => goToNoticeBoard()}
          >
            <span className='Dashboard__verticalDots'>
              <MoreVertIcon />
            </span>
            <Row className='mt-2'>
              <Col xs={8} className='pl-4'>
                <p className='Dashboard__todaysHitsText'>Notice Board</p>
                {(roleArray.includes(3) || roleArray.includes(4)) && (
                  <Button variant='noticeBoardPost'>
                    <BorderColorIcon />
                    <span className='m-2'>Write a post</span>
                  </Button>
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
                <p className='p-2 Dashboard__noticeText'>{elem.notice_text}</p>
              </div>
            ))}
          </div>
        );
      case 'homeworkCreator':
        return (
          <div className='Dashboard__innovation pt-4 px-3 pb-3'>
            <h4 className='Dashboard_homeworkCreator'>Witness </h4>
            <h4 className='Dashboard_homeworkCreator'>
              The <span>innovation</span>
            </h4>
            <p className='mr-5 Dashboard_homeworkCreator'>
              Create tests &amp; home-works in 4 simple steps
            </p>
            <Button
              className='Dashboard_homeworkCreator'
              variant='dashboardBlueOnWhite'
              onClick={() => goToHomeWorkCreator()}
            >
              Let&apos;s go
              <span>
                <ChevronRightIcon />
              </span>
            </Button>
            <div className='Dashboard__assignment my-4 Dashboard_homeworkCreator'>
              <section className='Dashboard__scrollableCard'>
                <div>
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
                      <img src={param.feature_icon} alt='assignment' height='40px' width='40px' />
                    </Col>
                  </Row>
                </div>
                <div>
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
                      <img src={param.feature_icon} alt='assignment' height='40px' width='40px' />
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
            heading='Analysis'
            subHeading='See detailed reports of every student and assignments.'
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            backGround={param.start_colour}
            backgroundImg={`linear-gradient(90deg, ${param.start_colour} 0%, ${param.end_colour} 100%)`}
            buttonClick={role === 1 || role === 2 ? goToStudentAnalysis : goToTeacherAnalysis}
          />
        );
      case 'fees':
        return (
          <DashboardCards
            image={param.feature_icon}
            width={53}
            height={78}
            heading='Fees'
            subHeading='See fees history and amount to be paid for coming months.'
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            backGround={param.start_colour}
            backgroundImg={`linear-gradient(90deg, ${param.start_colour} 0%, ${param.end_colour} 100%)`}
            buttonClick={role === 1 || role === 2 ? goToFees : goToTeacherFees}
          />
        );
      case 'posters':
        return (
          <div className='m-2 mt-4'>
            <AspectCards
              data={data.posters}
              clickCard={() => {}}
              clickAddCard={() => {}}
              section='notice'
              noAddCard
              bigAspectCard
            />
          </div>
        );
      case 'starPerformers':
        return (
          <>
            <h6
              style={{
                fontFamily: 'Montserrat-Medium',
                lineHeight: '20px',
                textAlign: 'left',
                fontSize: '14px',
              }}
              className='mx-3 mt-4 mb-0'
            >
              Our Star Performers
            </h6>
            <AspectCards
              data={data.star_performers}
              clickCard={() => {}}
              clickAddCard={() => {}}
              section='notice'
              noAddCard
            />
          </>
        );
      case 'testimonials':
        return (
          <>
            <h6
              style={{
                fontFamily: 'Montserrat-Medium',
                lineHeight: '20px',
                textAlign: 'left',
                fontSize: '14px',
              }}
              className='mx-3 mt-4 mb-0'
            >
              Testimonials
            </h6>
            <AspectCards
              data={data.testimonials}
              clickCard={() => {}}
              clickAddCard={() => {}}
              section='notice'
              noAddCard
            />
          </>
        );
      case 'aboutUs':
        return (
          <div className='text-left m-3 mt-5'>
            <h5 className='Dummy__aboutus'>About us</h5>
            <p className='Dummy__aboutData'>{data.about_us}</p>

            <h6 className='Dummy__connect'>Connect with us</h6>

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
                    <a href={elem.link} className='text-center m-3' key={elem.key}>
                      <img src={elem.image} alt={elem.link} className='Dummy__socialLinks' />
                    </a>
                  );
                })}
              <a
                href={data.other_link}
                className='text-center m-3'
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
          />
        ) : (
          <DashboardCards
            image={param.feature_icon}
            width={51}
            height={78}
            heading='Courses'
            subHeading='Increase your profit by building and selling your courses here.'
            boxshadow='0px 1px 3px 0px rgba(8, 203, 176, 0.4)'
            backgroundImg={`linear-gradient(90deg, ${param.start_colour} 0%, ${param.end_colour} 100%)`}
            backGround={param.start_colour}
            buttonClick={goToCoursesForTeacher}
          />
        );
      case 'liveClasses':
        return (
          <DashboardCards
            image={param.feature_icon}
            width={91}
            height={73}
            heading='Live Classes'
            subHeading={
              roleArray.includes(3) || roleArray.includes(4)
                ? 'Conduct all your live classes here effectively'
                : 'Attend all your live classes from here.'
            }
            boxshadow='0px 1px 3px 0px rgba(154, 129, 171, 0.75)'
            backGround={param.start_colour}
            backgroundImg={`linear-gradient(90deg, ${param.start_colour} 0%, ${param.end_colour} 100%)`}
            buttonText={roleArray.includes(3) || roleArray.includes(4) ? 'Go live now' : ''}
            buttonClick={goToLiveClasses}
          />
        );
      case 'onlineAssignment':
        return (
          <div>
            <Tests startHomework={startHomework} startLive={startLiveTest} />
          </div>
        );
      case 'studyBin':
        return (
          <DashboardCards
            image={param.feature_icon} // student
            width={56}
            height={86}
            coloredHeading='Library'
            color='rgba(0, 102, 255, 0.87)'
            subHeading='Access content uploaded by institute here.'
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            buttonClick={goToStudyBin}
          />
        );
      case 'admissionForm':
        return (
          <Card
            className='DashboardCards'
            style={{ border: '1px solid rgba(112, 112, 112, 0.5)', margin: 'auto' }}
          >
            <Row className='mx-0 justify-content-center mt-2'>
              <Col xs={8} className='text-left p-3'>
                <h6 className='Dummy__joinUs'>Join us NOW!</h6>
                <p className='mb-0 Dummy__joinDetails'>Your are not in any batch yet</p>
                <p className='Dummy__joinSmall'>Fill admission form to join us.</p>
                <Button
                  variant='customPrimarySmol'
                  className='mb-3'
                  onClick={() => history.push('/admissionform')}
                >
                  Fill admission form
                </Button>
              </Col>
              <Col xs={4} className='p-3 mt-3' style={{ textAlign: 'right' }}>
                {/* form */}
                <img
                  src={param.feature_icon}
                  alt='form'
                  style={{ width: '100px' }}
                  className='DashboardCard_Image'
                />
              </Col>
            </Row>
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
                <h6 className='Dummy__connect'>Share app with friends</h6>
                <p className='mb-0 Dummy__joinDetails'>Enjoying the application?</p>
                <p className='Dummy__joinSmall'>Share with your friends</p>
                <Button
                  variant='customPrimarySmol'
                  className='mb-3'
                  style={{ padding: '10px 20px' }}
                  onClick={() => shareThis()}
                >
                  Share
                </Button>
              </Col>
              <Col xs={5} className='p-3 mt-3' style={{ textAlign: 'right' }}>
                {/* share */}
                <img
                  src={param.feature_icon}
                  alt='form'
                  style={{ width: '100px' }}
                  className='DashboardCard_Image'
                />
              </Col>
            </Row>
          </Card>
        );
      case 'contactUs':
        return (
          <Card
            className='DashboardCards mt-3 mb-2'
            style={{ border: '1px solid rgba(112, 112, 112, 0.5)', margin: 'auto' }}
          >
            <Row className='mx-3 justify-content-left mt-2'>
              <h6 className='Dummy__joinUs'>Contact us</h6>
            </Row>
            {data.address.location && (
              <Row className='mx-0 justify-content-center mt-2'>
                <Col xs={2} sm={1} className='pr-0'>
                  <LocationOnIcon />
                </Col>
                <Col xs={10} sm={11} className='text-left p-0 my-auto pr-4'>
                  <p className='mb-0 Dummy__joinDetails'>{data.address.location}</p>
                  <p className='Dummy__joinSmall'>Address</p>
                </Col>
              </Row>
            )}

            {data.address.client_contact && (
              <Row className='mx-0 justify-content-center mt-2'>
                <Col xs={2} sm={1} className='pr-0'>
                  <PhoneIcon />
                </Col>
                <Col xs={10} sm={11} className='text-left p-0 my-auto pr-4'>
                  <p className='mb-0 Dummy__joinDetails'>{data.address.client_contact}</p>
                  <p className='Dummy__joinSmall'>Phone</p>
                </Col>
              </Row>
            )}
            {data.address.client_email && (
              <Row className='mx-0 justify-content-center mt-2'>
                <Col xs={2} sm={1} className='pr-0'>
                  <AlternateEmailIcon />
                </Col>
                <Col xs={10} sm={11} className='text-left p-0 my-auto pr-4'>
                  <p className='mb-0 Dummy__joinDetails'>{data.address.client_email}</p>
                  <p className='Dummy__joinSmall'>Email</p>
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
            heading='CRM'
            subHeading='Manage All your customer Relations Management Enquiries here.'
            boxshadow='0px 1px 3px 0px rgba(8, 203, 176, 0.4)'
            backgroundImg={`linear-gradient(90deg, ${param.start_colour} 0%, ${param.end_colour} 100%)`}
            backGround={param.start_colour}
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
                  heroImage={branding.branding.client_logo}
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
            heading='My display page'
            color='rgba(255, 236, 222, 1)'
            subHeading='This is like your website. Choose what want to show your guests.'
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            backgroundImg={`linear-gradient(90deg, ${param.start_colour} 0%, ${param.end_colour} 100%)`}
            buttonClick={goToDisplayPage}
          />
        );
      // case 'chats':
      //   return (
      //     <DashboardCards
      //       image={param.feature_icon}
      //       heading='Chats'
      //       boxshadow='0px 1px 3px 0px rgba(8, 203, 176, 0.4)'
      //       subHeading='Chat with your peers or teachers.'
      //       backgroundImg={`linear-gradient(90deg, ${param.start_colour} 0%, ${param.end_colour} 100%)`}
      //       backGround={param.start_colour}
      //       buttonClick={goToChats}
      //     />
      //   );
      default:
        return null;
    }
  };

  return (
    <div className='mb-4'>
      <div className='Dashboard__headerCard pb-3 mb-4'>
        <Row className='pt-4 pr-4'>
          <span className='ml-auto p-3'>{/* <MoreVertIcon /> */}</span>
        </Row>
        {hasLoaded && <h3 className='Dummy__coachingName text-center'>{data.client_name}</h3>}
        {hasLoaded && (
          <p className='Dummy__tagline mb-4 text-center mb-5'>{data.client_tag_line}</p>
        )}

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
          <Col xs={8} md={roleArray.includes(1) || roleArray.includes(2) ? 11 : 10}>
            <h4 className='Dashboard__headingText'>
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
              src={branding.client_logo || YCIcon}
              className='img-fluid'
              alt='profile'
              width='80px'
              height='80px'
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
              onClick={() => addDetails('teacher')}
            >
              <PersonAddIcon />
              <span className=''>Teacher</span>
            </Button>

            <Button
              style={{ paddingRight: '10px', paddingLeft: '10px' }}
              variant='noticeBoardPost'
              onClick={() => addDetails('admin')}
            >
              <PersonAddIcon />
              <span className=''>Admin</span>
            </Button>
          </Row>
        </Modal.Body>
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
});

const mapDispatchToProps = (dispatch) => ({
  clearClientIdDetails: () => {
    dispatch(clientUserIdActions.clearClientIdDetails());
  },
  clearProfile: () => {
    dispatch(userProfileActions.clearUserProfile());
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
  setFolderIdArrayToStore: (payload) => {
    dispatch(studyBinActions.setFolderIDArrayToStore(payload));
  },
  setDashboardDataToStore: (payload) => {
    dispatch(dashboardActions.setDashboardDataToStore(payload));
  },

  setAnalysisStudentObjectToStore: (payload) => {
    dispatch(analysisActions.setAnalysisStudentObjectToStore(payload));
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
  setTestTypeToStore: PropTypes.func.isRequired,
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
  firstTimeLogin: PropTypes.bool.isRequired,
};
