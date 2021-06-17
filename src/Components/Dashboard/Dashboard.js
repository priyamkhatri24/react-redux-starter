import React, { useState, useEffect } from 'react';
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
import { get, apiValidation } from '../../Utilities';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import dashboardAssignmentImage from '../../assets/images/Dashboard/dashboardAssignment.svg';
import userAvatar from '../../assets/images/user.svg';
import { userProfileActions } from '../../redux/actions/userProfile.action';
import { clientUserIdActions } from '../../redux/actions/clientUserId.action';
import { testsActions } from '../../redux/actions/tests.action';
import { courseActions } from '../../redux/actions/course.action';
import hands from '../../assets/images/Dashboard/hands.svg';
import { AspectCards, CoursesCards, DashboardCards } from '../Common';
// import offlineAssignment from '../../assets/images/Dashboard/offline.svg';
import camera from '../../assets/images/Dashboard/camera.svg';
import analysis from '../../assets/images/Dashboard/analysis.svg';
import analysisHands from '../../assets/images/Dashboard/analysishands.svg';
import student from '../../assets/images/Dashboard/student.svg';
import Tests from '../Tests/Tests';
import './Dashboard.scss';
import { admissionActions } from '../../redux/actions/admissions.action';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
import { getComeBackFromTests } from '../../redux/reducers/firstTimeLogin.reducer';
import { studyBinActions } from '../../redux/actions/studybin.actions';
import fb from '../../assets/images/dummyDashboard/fb.png';
import linkedin from '../../assets/images/dummyDashboard/linkedin.svg';
import insta from '../../assets/images/dummyDashboard/instagram.svg';
import share from '../../assets/images/dummyDashboard/share.svg';
import whatsapp from '../../assets/images/dummyDashboard/whatsapp.svg';
import youtube from '../../assets/images/dummyDashboard/youtube.png';
import telegram from '../../assets/images/dummyDashboard/telegram.svg';
import form from '../../assets/images/dummyDashboard/form.svg';
import '../Login/DummyDashboard.scss';
import { dashboardActions } from '../../redux/actions/dashboard.action';
import { analysisActions } from '../../redux/actions/analysis.action';

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
  } = props;
  const [time, setTime] = useState('');
  const [notices, setNotices] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [admissions, setAdmissions] = useState({});
  const [data, setData] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [optionsModal, setOptionsModal] = useState(false);
  const openOptionsModal = () => setOptionsModal(true);
  const closeOptionsModal = () => setOptionsModal(false);

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
    const payload = {
      client_id: clientId,
      client_user_id: clientUserId,
    };

    get(payload, '/getRecentDataLatest')
      .then((res) => {
        const result = apiValidation(res);
        console.log(result);
        setNotices(result.notice);
        setAdmissions(result.admission);
        setAttendance(result.attendance);
        setData(result);
        setHasLoaded(true);
        setDashboardDataToStore(result);
      })
      .catch((err) => console.error(err));
    partsOfDay();

    get({ client_user_id: clientUserId }, '/getRecentCourses').then((res) => {
      const result = apiValidation(res);
      setAllCourses(result.assigned_courses);
      setMyCourses(result.subscribed_courses);
      console.log(result);
    });
  }, [clientId, clientUserId]);

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

  const startHomework = (responseArray, testId) => {
    const { push } = history;
    setTestResultArrayToStore(responseArray);
    setTestIdToStore(testId);
    setTestTypeToStore('homework');
    push('/questiontaker');
  };

  const startLiveTest = (responseArray, startTime = 0, endTime = 0, testType, testId) => {
    const { push } = history;
    setTestResultArrayToStore(responseArray);
    setTestEndTimeToStore(endTime);
    setTestStartTimeToStore(startTime);
    setTestTypeToStore(testType);
    setTestIdToStore(testId);
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

    push({ pathname: '/courses/buyCourse', state: { id, clientUserId } });
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

  return (
    <>
      <div className='Dashboard__headerCard pb-3 mb-4'>
        <Row className='pt-4 pr-4'>
          <span className='ml-auto p-3'>{/* <MoreVertIcon /> */}</span>
        </Row>
        {hasLoaded && <h3 className='Dummy__coachingName text-center'>{data.client_name}</h3>}
        {hasLoaded && (
          <p className='Dummy__tagline mb-4 text-center mb-5'>{data.client_tag_line}</p>
        )}
        <Row className='mx-auto px-2 mt-4'>
          <Col xs={4} onClick={() => goToProfile()}>
            <img
              src={profileImage || userAvatar}
              className='Dashboard__profileImage float-right img-responsive'
              alt='profile'
            />
          </Col>
          <Col xs={8}>
            <h4 className='Dashboard__headingText'>{time}</h4>
            <h4 className='Dashboard__headingText'>{firstName}</h4>
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
      {/* *****************************Teacher View ********************************* */}
      {(roleArray.includes(3) || roleArray.includes(4)) && (
        <>
          <DashboardCards
            image={camera}
            heading='Live Classes'
            subHeading={
              roleArray.includes(3) || roleArray.includes(4)
                ? 'Conduct all your live classes here effectively'
                : 'Attend all your live classes from here.'
            }
            boxshadow='0px 1px 3px 0px rgba(154, 129, 171, 0.75)'
            backGround='rgb(247,236,255)'
            backgroundImg='linear-gradient(90deg, rgba(247,236,255,1) 0%, rgba(154,129,171,1) 100%)'
            buttonText={roleArray.includes(3) || roleArray.includes(4) ? 'Go live now' : ''}
            buttonClick={goToLiveClasses}
          />

          {roleArray.includes(4) && Object.keys(admissions).length > 0 && (
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
          )}

          {roleArray.includes(4) && Object.keys(admissions).length === 0 && <Skeleton count={20} />}

          <div className='Dashboard__innovation pt-4 px-3 pb-3'>
            <h4>Witness </h4>
            <h4>
              The <span>innovation</span>
            </h4>
            <p className='mr-5'>Create tests &amp; home-works in 4 simple steps</p>
            <Button variant='dashboardBlueOnWhite' onClick={() => goToHomeWorkCreator()}>
              Let&apos;s go
              <span>
                <ChevronRightIcon />
              </span>
            </Button>
            <div className='Dashboard__assignment my-4'>
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
                      <img
                        src={dashboardAssignmentImage}
                        alt='assignment'
                        height='40px'
                        width='40px'
                      />
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
                      <img
                        src={dashboardAssignmentImage}
                        alt='assignment'
                        height='40px'
                        width='40px'
                      />
                    </Col>
                  </Row>
                </div>
              </section>
            </div>
          </div>

          <DashboardCards
            image={analysis}
            heading='Courses'
            subHeading='Increase your profit by building and selling your courses here.'
            boxshadow='0px 1px 3px 0px rgba(8, 203, 176, 0.4)'
            backgroundImg='linear-gradient(90deg, rgba(236,255,252,1) 0%, rgba(8,203,176,1) 100%)'
            backGround='rgb(236,255,252)'
            buttonClick={goToCoursesForTeacher}
          />

          <DashboardCards
            image={analysis}
            heading='Fees'
            subHeading='See fees history and amount to be paid for coming months.'
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            backGround='rgb(238,232,241)'
            backgroundImg='linear-gradient(90deg, rgba(238,232,241,1) 0%, rgba(220,16,16,1) 100%)'
            buttonClick={goToTeacherFees}
          />

          <DashboardCards
            image={analysisHands}
            heading='Analysis'
            subHeading='See detailed reports of every student and assignments.'
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            backGround='rgb(235,245,246)'
            backgroundImg='linear-gradient(90deg, rgba(235,245,246,1) 0%, rgba(142,230,38,1) 100%)'
            buttonClick={goToTeacherAnalysis}
          />

          <DashboardCards
            image={student}
            coloredHeading='Study Bin'
            color='rgba(0, 102, 255, 0.87)'
            subHeading='Here you can find all the stuffs pre-loaded for you from Ingenium.'
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            buttonClick={goToStudyBin}
          />

          <DashboardCards
            image={student}
            heading='My display page'
            color='rgba(255, 236, 222, 1)'
            subHeading='This is like your website. Choose what want to show your guests.'
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            backgroundImg='linear-gradient(90deg, rgba(255, 236, 222, 1) 0%, rgba(255, 145, 61, 1)'
            buttonClick={goToDisplayPage}
          />

          <div
            className='Dashboard__attendance p-4'
            onClick={() => gotToAttendance()}
            onKeyDown={() => gotToAttendance()}
            tabIndex='-1'
            role='button'
          >
            <div className='Dashboard__attendanceCard mx-auto pt-4'>
              <img src={hands} alt='hands' className='mx-auto d-block' />
              <Row className='m-3'>
                <span className='Dashboard__todaysHitsText my-auto'>Attendance</span>
                <span className='ml-auto'>
                  <ChevronRightIcon />
                </span>
              </Row>

              <p className='Dashboard__attendanceSubHeading mx-3'>
                Record attendance of the students and notify parents via SMS daily.
              </p>

              <hr />

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
                <img src={dashboardAssignmentImage} alt='notice' height='80' width='80' />
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

          <Card className='m-2 mt-4' style={{ border: '1px solid rgba(112, 112, 112, 0.5)' }}>
            <Row className='mx-0 justify-content-center mt-2'>
              <Col xs={7} className='text-left p-2'>
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
              <Col xs={5} className='p-2 mt-3 text-center'>
                <img src={share} alt='form' className='img-fluid' />
              </Col>
            </Row>
          </Card>

          {/* <CoursesCards
            allCourses={allCourses}
            myCourses={myCourses}
            goToCourse={goToCourses}
            buyCourseId={goToBuyCourse}
            myCourseId={goToMyCourse}
          /> */}
          {/* <DashboardCards
            image={offlineAssignment}
            heading='Offline assignment'
            subHeading='Record marks of all the pen-paper tests and send
         the marks to parents in simple way.'
            boxshadow='0px 1px 3px 0px rgba(8, 203, 176, 0.4)'
            backgroundImg='linear-gradient(90deg, rgba(236,255,252,1) 0%, rgba(8,203,176,1) 100%)'
            backGround='rgb(236,255,252)'
          />

          <DashboardCards
            image={camera}
            heading='Send photos &amp; files'
            subHeading='Send question papers, notes and books as
        photos or files such as .pdf, .doc, .txt, etc..'
            boxshadow='0px 1px 3px 0px rgba(154, 129, 171, 0.75)'
            backGround='rgb(247,236,255)'
            backgroundImg='linear-gradient(90deg, rgba(247,236,255,1) 0%, rgba(154,129,171,1) 100%)'
          />

          <DashboardCards
            image={student}
            heading='Student corner'
            subHeading='Here you can find all the stuffs pre-loaded for you from Ingenium.'
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            backGround='rgb(248,252,255)'
            backgroundImg='linear-gradient(90deg, rgba(248,252,255,1) 0%, rgba(188,224,253,1) 100%)'
          /> */}
        </>
      )}

      {/* *****************************Student View ********************************* */}
      {(roleArray.includes(1) || roleArray.includes(2)) && (
        <>
          {hasLoaded && (
            <div className='m-2 mt-4'>
              <AspectCards
                data={data.posters}
                clickCard={() => {}}
                clickAddCard={() => {}}
                section='notice'
                noAddCard
                bigAspectCard
              />

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
            </div>
          )}
          {hasLoaded && (
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
          )}

          <CoursesCards
            allCourses={allCourses}
            myCourses={myCourses}
            goToCourse={goToCourses}
            buyCourseId={goToBuyCourse}
            myCourseId={goToMyCourse}
          />

          <DashboardCards
            image={camera}
            heading='Live Classes'
            subHeading={
              roleArray.includes(3) || roleArray.includes(4)
                ? 'Conduct all your live classes here effectively'
                : 'Attend all your live classes from here.'
            }
            boxshadow='0px 1px 3px 0px rgba(154, 129, 171, 0.75)'
            backGround='rgb(247,236,255)'
            backgroundImg='linear-gradient(90deg, rgba(247,236,255,1) 0%, rgba(154,129,171,1) 100%)'
            buttonText={roleArray.includes(3) || roleArray.includes(4) ? 'Go live now' : ''}
            buttonClick={goToLiveClasses}
          />

          <div>
            <Tests startHomework={startHomework} startLive={startLiveTest} />
          </div>
          <DashboardCards
            image={analysis}
            heading='Fees'
            subHeading='See fees history and amount to be paid for coming months.'
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            backGround='rgb(238,232,241)'
            backgroundImg='linear-gradient(90deg, rgba(238,232,241,1) 0%, rgba(220,16,16,1) 100%)'
            buttonClick={goToFees}
          />

          <DashboardCards
            image={analysisHands}
            heading='Analysis'
            subHeading='See detailed reports of every student and assignments.'
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            backGround='rgb(235,245,246)'
            backgroundImg='linear-gradient(90deg, rgba(235,245,246,1) 0%, rgba(142,230,38,1) 100%)'
            buttonClick={goToStudentAnalysis}
          />
          <div
            className='Dashboard__noticeBoard mx-auto p-3'
            onClick={() => goToNoticeBoard()}
            role='button'
            tabIndex='-1'
            onKeyDown={() => goToNoticeBoard()}
          >
            <span className='Dashboard__verticalDots'>
              <MoreVertIcon />
            </span>
            <Row className='mt-2'>
              <Col xs={8}>
                <p className='Dashboard__todaysHitsText noticeboard_heading'>Notice Board</p>
                {(roleArray.includes(3) || roleArray.includes(4)) && (
                  <Button variant='noticeBoardPost'>
                    <BorderColorIcon />
                    <span className='m-2'>Write a post</span>
                  </Button>
                )}
              </Col>
              <Col className='noticeboard_img' xs={4}>
                <img src={dashboardAssignmentImage} alt='notice' height='80' width='80' />
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
          <DashboardCards
            image={student}
            coloredHeading='Study Bin'
            color='rgba(0, 102, 255, 0.87)'
            subHeading='Here you can find all the stuffs pre-loaded for you from Ingenium.'
            boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
            buttonClick={goToStudyBin}
          />

          <Card className='m-3' style={{ border: '1px solid rgba(112, 112, 112, 0.5)' }}>
            <Row className='mx-0 justify-content-center mt-2'>
              <Col xs={8} className='text-left p-2'>
                <h6 className='Dummy__joinUs'>Join us NOW!</h6>
                <p className='mb-0 Dummy__joinDetails'>Your are not in any batch yet</p>
                <p className='Dummy__joinSmall'>Fill admission form to join us.</p>
              </Col>
              <Col xs={4} className='p-2'>
                <img src={form} alt='form' className='img-fluid' />
              </Col>
              <Button
                variant='customPrimarySmol'
                className='mb-3'
                onClick={() => history.push('/admissionform')}
              >
                Fill admission form
              </Button>
            </Row>
          </Card>

          <Card className='m-3 mt-4' style={{ border: '1px solid rgba(112, 112, 112, 0.5)' }}>
            <Row className='mx-0 justify-content-center mt-2'>
              <Col xs={7} className='text-left p-2'>
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
              <Col xs={5} className='p-2 mt-3 text-center'>
                <img src={share} alt='form' className='img-fluid' />
              </Col>
            </Row>
          </Card>

          {hasLoaded && Object.keys(data.address).length > 0 && (
            <Card className='m-3 mt-4' style={{ border: '1px solid rgba(112, 112, 112, 0.5)' }}>
              <Row className='mx-3 justify-content-left mt-2'>
                <h6 className='Dummy__joinUs'>Contact us</h6>
              </Row>
              {data.address.location && (
                <Row className='mx-0 justify-content-center mt-2'>
                  <Col xs={2} className='pr-0'>
                    <LocationOnIcon />
                  </Col>
                  <Col xs={10} className='text-left p-0 my-auto pr-4'>
                    <p className='mb-0 Dummy__joinDetails'>{data.address.location}</p>
                    <p className='Dummy__joinSmall'>Address</p>
                  </Col>
                </Row>
              )}

              {data.address.client_contact && (
                <Row className='mx-0 justify-content-center mt-2'>
                  <Col xs={2} className='pr-0'>
                    <PhoneIcon />
                  </Col>
                  <Col xs={10} className='text-left p-0 my-auto pr-4'>
                    <p className='mb-0 Dummy__joinDetails'>{data.address.client_contact}</p>
                    <p className='Dummy__joinSmall'>Phone</p>
                  </Col>
                </Row>
              )}
              {data.address.client_email && (
                <Row className='mx-0 justify-content-center mt-2'>
                  <Col xs={2} className='pr-0'>
                    <AlternateEmailIcon />
                  </Col>
                  <Col xs={10} className='text-left p-0 my-auto pr-4'>
                    <p className='mb-0 Dummy__joinDetails'>{data.address.client_email}</p>
                    <p className='Dummy__joinSmall'>Email</p>
                  </Col>
                </Row>
              )}
            </Card>
          )}
        </>
      )}
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
    </>
  );
};

const mapStateToProps = (state) => ({
  userProfile: getUserProfile(state),
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  roleArray: getRoleArray(state),
  branding: getCurrentBranding(state),
  comeBackFromTests: getComeBackFromTests(state),
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
};
