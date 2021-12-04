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
              <div key={ele} className='square'>
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
          className={`bottomNavItems${active === 'library' ? ' activeNav' : ''}`}
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
