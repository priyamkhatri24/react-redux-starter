import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HomeIcon from '@material-ui/icons/Home';
import ChatIcon from '@material-ui/icons/ChatBubbleOutline';
import LibraryIcon from '@material-ui/icons/LocalLibraryOutlined';
import CoursesIcon from '@material-ui/icons/BookOutlined';
import MoreIcon from '@material-ui/icons/MoreHorizOutlined';
import { getCurrentDashboardData } from '../../../redux/reducers/dashboard.reducer';
import { getRoleArray } from '../../../redux/reducers/clientUserId.reducer';
import './BottomNavigation.scss';

const BottomNavigation = (props) => {
  const { history, roleArray, activeNav, dashboardData } = props;
  const [scrolledUp, setScrolledUp] = useState(false);
  const [active, setActive] = useState(activeNav);

  // useEffect(() => {}, []);

  const goToHome = () => {
    history.push('/');
  };

  const goToChats = () => {
    history.push('/conversations');
  };

  const goToStudyBin = () => {
    history.push('/studybin');
  };

  const goToCoursesForTeacher = () => {
    history.push({ pathname: '/courses/teachercourse' });
  };

  const goToDisplayPage = () => {
    history.push('/displayPage');
  };

  const goToCRM = () => {
    history.push('/crm');
  };

  const goToFees = () => {
    history.push('/fees');
  };

  const gotToAttendance = () => {
    history.push('/attendance');
  };

  const goToTeacherAnalysis = () => {
    history.push('/analysis/teacher');
  };

  const goToTeacherFees = () => {
    history.push('/teacherfees');
  };

  const goToHomeWorkCreator = () => {
    history.push({ pathname: '/homework', state: { letsGo: true } });
  };

  const goToLiveClasses = () => {
    history.push({ pathname: '/liveclasses' });
  };

  const goToAdmissions = () => {
    history.push({ pathname: '/admissions' });
  };

  const goToNoticeBoard = () => {
    history.push({ pathname: '/noticeboard' });
    // console.log(history);
  };

  const goToClickedPage = (page) => {
    if (page === 'displayPage') {
      goToDisplayPage();
    } else if (page === 'courses') {
      goToCoursesForTeacher();
    } else if (page === 'chats') {
      goToChats();
    } else if (page === 'crm') {
      goToCRM();
    } else if (page === 'fees') {
      goToTeacherFees();
    } else if (page === 'liveClasses') {
      goToLiveClasses();
    } else if (page === 'studyBin') {
      goToStudyBin();
    } else if (page === 'admission') {
      goToAdmissions();
    } else if (page === 'videos') {
      console.log('videos');
    } else if (page === 'homeworkCreator') {
      goToHomeWorkCreator();
    } else if (page === 'analysis') {
      goToTeacherAnalysis();
    } else if (page === 'attendance') {
      gotToAttendance();
    } else if (page === 'noticeBoard') {
      goToNoticeBoard();
    } else {
      console.log(page);
    }
  };

  const moreClicked = () => {
    setScrolledUp((prev) => !prev);
    if (!scrolledUp) {
      setActive('more');
    } else {
      setActive(activeNav);
    }
  };

  const backDropClicked = () => {
    setActive(activeNav);
    setScrolledUp(false);
  };

  return roleArray.includes(3) || roleArray.includes(4) ? (
    /* eslint-disable */
    <>
      {scrolledUp ? <div onClick={backDropClicked} className='backDrop' /> : null}
      <div className={`bottomScrollBar${scrolledUp ? ' scrolledUp' : ''}`}>
        <div onClick={backDropClicked} className='horizontalLine' />
        <div className='squaresC'>
          {dashboardData.featureOrder.map((ele) => {
            return (
              <div
                onClick={() => goToClickedPage(ele)}
                key={ele}
                className={`square${ele === activeNav ? ' activeSquare' : ''}`}
              >
                {ele}
              </div>
            );
          })}
        </div>
      </div>
      <div className='bottomNavigation'>
        <div
          onClick={goToHome}
          className={`bottomNavItems${active === 'home' ? ' activeNav' : ''}`}
        >
          <HomeIcon />
          <p className='bottomNavSmallText'>Home</p>
        </div>
        <div
          onClick={goToChats}
          className={`bottomNavItems${active === 'chats' ? ' activeNav' : ''}`}
        >
          <ChatIcon />
          <p className='bottomNavSmallText'>Chats</p>
        </div>
        <div
          onClick={goToStudyBin}
          className={`bottomNavItems${active === 'studyBin' ? ' activeNav' : ''}`}
        >
          <LibraryIcon />
          <p className='bottomNavSmallText'>Library</p>
        </div>
        <div
          onClick={goToCoursesForTeacher}
          className={`bottomNavItems${active === 'courses' ? ' activeNav' : ''}`}
        >
          <CoursesIcon />
          <p className='bottomNavSmallText'>Courses</p>
        </div>
        <div
          onClick={moreClicked}
          className={`bottomNavItems${active === 'more' ? ' activeNav' : ''}`}
        >
          <MoreIcon />
          <p className='bottomNavSmallText'>More</p>
        </div>
      </div>
    </>
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    dashboardData: getCurrentDashboardData(state),
    roleArray: getRoleArray(state),
  };
};

export default connect(mapStateToProps, null)(BottomNavigation);

BottomNavigation.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
  activeNav: PropTypes.string.isRequired,
  dashboardData: PropTypes.instanceOf(Object).isRequired,
};
