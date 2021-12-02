import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HomeIcon from '@material-ui/icons/Home';
import ChatIcon from '@material-ui/icons/ChatBubbleOutline';
import LibraryIcon from '@material-ui/icons/LocalLibraryOutlined';
import CoursesIcon from '@material-ui/icons/BookOutlined';
import MoreIcon from '@material-ui/icons/MoreHorizOutlined';
import { getRoleArray } from '../../../redux/reducers/clientUserId.reducer';
import './BottomNavigation.scss';

const BottomNavigation = (props) => {
  const { history, roleArray, activeNav } = props;

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

  return roleArray.includes(3) || roleArray.includes(4) ? (
    /* eslint-disable */
    <div className='bottomNavigation'>
      <div
        onClick={goToHome}
        className={`bottomNavItems${activeNav === 'home' ? ' activeNav' : ''}`}
      >
        <HomeIcon />
        <p className='bottomNavSmallText'>Home</p>
      </div>
      <div
        onClick={goToChats}
        className={`bottomNavItems${activeNav === 'chats' ? ' activeNav' : ''}`}
      >
        <ChatIcon />
        <p className='bottomNavSmallText'>Chats</p>
      </div>
      <div
        onClick={goToStudyBin}
        className={`bottomNavItems${activeNav === 'library' ? ' activeNav' : ''}`}
      >
        <LibraryIcon />
        <p className='bottomNavSmallText'>Library</p>
      </div>
      <div
        onClick={goToCoursesForTeacher}
        className={`bottomNavItems${activeNav === 'courses' ? ' activeNav' : ''}`}
      >
        <CoursesIcon />
        <p className='bottomNavSmallText'>Courses</p>
      </div>
      <div
        onClick={() => {}}
        className={`bottomNavItems${activeNav === 'more' ? ' activeNav' : ''}`}
      >
        <MoreIcon />
        <p className='bottomNavSmallText'>More</p>
      </div>
    </div>
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    roleArray: getRoleArray(state),
  };
};

export default connect(mapStateToProps, null)(BottomNavigation);

BottomNavigation.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
  activeNav: PropTypes.string.isRequired,
};
