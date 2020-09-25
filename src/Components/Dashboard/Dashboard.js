import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { connect } from 'react-redux';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { getUserProfile } from '../../redux/reducers/userProfile.reducer';
import { get, apiValidation } from '../../Utilities';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import dashboardAssignmentImage from '../../assets/images/Dashboard/dashboardAssignment.svg';
import { userProfileActions } from '../../redux/actions/userProfile.action';
import hands from '../../assets/images/Dashboard/hands.svg';
import { DashboardCards } from '../Common';
import offlineAssignment from '../../assets/images/Dashboard/offline.svg';
import camera from '../../assets/images/Dashboard/camera.svg';
import analysis from '../../assets/images/Dashboard/analysis.svg';
import student from '../../assets/images/Dashboard/student.svg';
import './Dashboard.scss';

const Dashboard = (props) => {
  const {
    clientId,
    clientUserId,
    userProfile: { firstName, profileImage },
    clearProfile,
  } = props;
  const [time, setTime] = useState('');
  const [notices, setNotices] = useState([]);

  const partsOfDay = () => {
    const hours = new Date().getHours();

    if (hours >= 0 && hours < 12) setTime('Good Morning,');
    else if (hours >= 12 && hours <= 17) setTime('Good Afternoon,');
    else if (hours >= 17 && hours < 21) setTime('Good Evening,');
    else if (hours >= 21 && hours < 24) setTime('Good Evening,');
  };

  useEffect(() => {
    const payload = {
      client_id: clientId,
      client_user_id: clientUserId,
    };

    get(payload, '/getRecentData')
      .then((res) => {
        const result = apiValidation(res);
        setNotices(result.notice);
      })
      .catch((err) => console.error(err));
    partsOfDay();
  }, [clientId, clientUserId]);

  const logout = () => {
    const { push } = props.history;
    clearProfile();
    push({ pathname: '/login' });
  };

  return (
    <>
      <div className='Dashboard__headerCard'>
        <Row className='pt-4 pr-4'>
          <span
            className='ml-auto'
            onClick={() => logout()}
            onKeyDown={() => logout()}
            role='button'
            tabIndex='-1'
          >
            <MoreVertIcon />
          </span>
        </Row>
        <Row className='mx-auto px-2 mt-4'>
          <Col xs={4}>
            <img
              src={profileImage}
              className='Dashboard__profileImage float-right img-responsive'
              alt='profile'
            />
          </Col>
          <Col xs={8}>
            <h4 className='Dashboard__headingText'>{time}</h4>
            <h4 className='Dashboard__headingText'>{firstName}</h4>
          </Col>
        </Row>

        <div className='Dashboard__todaysHits mx-auto my-4'>
          <Row className='mx-3 pt-2'>
            <span className='Dashboard__todaysHitsText'>Today&apos;s hit for you</span>
            <span className='ml-auto'>
              <MoreVertIcon />
            </span>
          </Row>
        </div>
      </div>

      <div className='Dashboard__innovation pt-4 px-3 pb-3'>
        <h4>Witness </h4>
        <h4>
          The <span>innovation</span>
        </h4>
        <p className='mr-5'>Create tests &amp; home-works in 4 simple steps</p>
        <Button variant='dashboardBlueOnWhite'>
          Let&apos;s go
          <span>
            <ChevronRightIcon />
          </span>
        </Button>
        <div className='Dashboard__assignment my-4'>
          <section className='Dashboard__scrollableCard'>
            <div>
              <Row>
                <Col xs={8} className='pr-0'>
                  <p className='Dashboard__scrollableCardHeading pt-2 pl-3 mb-0'>
                    Sent assignments
                  </p>
                  <p className='Dashboard__scrollableCardText pl-3 mt-1'>
                    All the tests &amp; homeworks sent to students are here...
                  </p>
                </Col>
                <Col xs={4} className='pt-3'>
                  <img src={dashboardAssignmentImage} alt='assignment' height='40px' width='40px' />
                </Col>
              </Row>
            </div>
            <div>
              <Row>
                <Col xs={8} className='pr-0'>
                  <p className='Dashboard__scrollableCardHeading pt-2 pl-3 mb-0'>
                    Saved assignments
                  </p>
                  <p className='Dashboard__scrollableCardText pl-3 mt-1'>
                    See all your saved tests &amp; homeworks here...
                  </p>
                </Col>
                <Col xs={4} className='pt-3'>
                  <img src={dashboardAssignmentImage} alt='assignment' height='40px' width='40px' />
                </Col>
              </Row>
            </div>
          </section>
        </div>
      </div>

      <div className='Dashboard__attendance p-4'>
        <div className='w-75 Dashboard__attendanceCard mx-auto pt-4'>
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

          <p>Recent Attendance</p>
        </div>
      </div>

      <div className='Dashboard__noticeBoard mx-auto p-3'>
        <span className='Dashboard__verticalDots'>
          <MoreVertIcon />
        </span>
        <Row className='mt-2'>
          <Col xs={8}>
            <p className='Dashboard__todaysHitsText'>Notice Board</p>
            <Button variant='noticeBoardPost'>
              <BorderColorIcon />
              <span className='m-2'>Write a post</span>
            </Button>
          </Col>
          <Col xs={4}>
            <img src={dashboardAssignmentImage} alt='notice' height='80' width='80' />
          </Col>
        </Row>

        <Row className='mt-5 ml-1 mb-3'>
          <span className='Dashboard__noticeBoardText my-auto'>Latest Notices</span>
          <span className='ml-auto' style={{ color: 'rgba(117, 117, 117, 1)' }}>
            <ChevronRightIcon />
          </span>
        </Row>

        {notices.map((elem) => (
          <div key={`elem${elem.notice_id}`} className='Dashboard__notice'>
            <Row>
              <Col xs={2} className='p-4'>
                <img
                  src={elem.profile_image}
                  alt='profile'
                  className='Dashboard__noticeImage d-block mx-auto'
                />
              </Col>
              <Col xs={10} className='pt-4'>
                <p className='Dashboard__scrollableCardHeading m-0'>
                  {`${elem.first_name} ${elem.last_name}`}
                </p>
                <p className='Dashboard__noticeSubHeading'>
                  {format(fromUnixTime(elem.time_of_notice), 'hh:m bbbb, do MMM yyy')}
                </p>
              </Col>
            </Row>
            <p className='p-2 Dashboard__noticeText'>{elem.notice_text}</p>
          </div>
        ))}
      </div>

      <DashboardCards
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
        image={analysis}
        heading='Admissions'
        subHeading='Manage students, teachers and batches from a single place.'
        boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
        backGround='rgb(235,245,246)'
        backgroundImg='linear-gradient(90deg, rgba(235,245,246,1) 0%, rgba(142,230,38,1) 100%)'
      />

      <DashboardCards
        image={analysis}
        heading='Fees'
        subHeading='See fees history and amount to be paid for coming months.'
        boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
        backGround='rgb(238,232,241)'
        backgroundImg='linear-gradient(90deg, rgba(238,232,241,1) 0%, rgba(220,16,16,1) 100%)'
      />
      <DashboardCards
        image={analysis}
        heading='Analysis'
        subHeading='See detailed reports of every student and assignments.'
        boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
        backGround='rgb(248,252,255)'
        backgroundImg='linear-gradient(90deg, rgba(248,252,255,1) 0%, rgba(188,224,253,1) 100%)'
      />
      <DashboardCards
        image={student}
        heading='Student corner'
        subHeading='Here you can find all the stuffs pre-loaded for you from Ingenium.'
        boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
        backGround='rgb(248,252,255)'
        backgroundImg='linear-gradient(90deg, rgba(248,252,255,1) 0%, rgba(188,224,253,1) 100%)'
      />

      <DashboardCards
        image={student}
        coloredHeading='Live'
        color='rgba(255, 0, 0, 0.87)'
        heading='Test'
        subHeading='Here you can find all the stuffs pre-loaded for you from Ingenium.'
        boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
      />
      <DashboardCards
        image={student}
        coloredHeading='Demo'
        color='rgba(207, 236, 0, 0.87)  '
        heading='Test'
        subHeading='Here you can find all the stuffs pre-loaded for you from Ingenium.'
        boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
      />

      <DashboardCards
        image={student}
        coloredHeading='Tests'
        color='rgba(0, 102, 255, 0.87)'
        subHeading='Here you can find all the stuffs pre-loaded for you from Ingenium.'
        boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
      />

      <DashboardCards
        image={student}
        coloredHeading='Study Bin'
        color='rgba(0, 102, 255, 0.87)'
        subHeading='Here you can find all the stuffs pre-loaded for you from Ingenium.'
        boxshadow='0px 1px 3px 0px rgba(0, 0, 0, 0.16)'
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  userProfile: getUserProfile(state),
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    clearProfile: () => {
      dispatch(userProfileActions.clearUserProfile());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

Dashboard.propTypes = {
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  clearProfile: PropTypes.func.isRequired,
  userProfile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    profileImage: PropTypes.string,
  }).isRequired,

  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
