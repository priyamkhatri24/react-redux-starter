import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import GavelIcon from '@material-ui/icons/Gavel';
import ShieldIcon from '@material-ui/icons/Security';
import userAvatar from '../../../assets/images/user.svg';
import { apiValidation, post } from '../../../Utilities';
import YCIcon from '../../../assets/images/ycIcon.png';
import { history } from '../../../Routing';
import { getCurrentBranding } from '../../../redux/reducers/branding.reducer';
import { getUserProfile } from '../../../redux/reducers/userProfile.reducer';
import { getRoleArray, getClientUserId } from '../../../redux/reducers/clientUserId.reducer';
import { userProfileActions } from '../../../redux/actions/userProfile.action';
import { clientUserIdActions } from '../../../redux/actions/clientUserId.action';
import { firstTimeLoginActions } from '../../../redux/actions/firsttimeLogin.action';
import './GlobalSearchBar.scss';

const GlobarSearchBar = (props) => {
  const {
    clientUserId,
    roleArray,
    style,
    branding,
    userProfile: { firstName, profileImage, lastName },
    clearClientIdDetails,
    clearProfile,
    setFirstTimeLoginToStore,
  } = props;

  const [expandSearch, setExpandSearch] = useState(false);
  const searchContainerRef = useRef(null);
  const [stuck, setStuck] = useState(false);

  const goToProfile = () => {
    history.push({ pathname: '/profile' });
  };

  useEffect(() => {
    document.addEventListener('scroll', () => {
      const distanceFromTop = searchContainerRef?.current?.getBoundingClientRect().top;
      if (distanceFromTop < 11) {
        setStuck(true);
      } else {
        setStuck(false);
      }
      if (window.pageYOffset <= 156) {
        setStuck(false);
      }
    });
  }, []);

  const logoutHandler = () => {
    const logoutPayload = {
      client_user_id: clientUserId,
    };
    console.log(logoutPayload);
    post(logoutPayload, '/logoutUser')
      .then((res) => {
        const result = apiValidation(res);
        if (result) {
          const { push } = history;
          push({ pathname: '/preload' });
          clearProfile();
          clearClientIdDetails();
          setFirstTimeLoginToStore(false);
        }
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: `Unable to logout :(`,
          timer: 3000,
        });
      });
  };

  const expandSearchBar = () => {
    setExpandSearch((prev) => !prev);
  };

  return roleArray.includes(3) || roleArray.includes(4) ? (
    <div
      className={`GlobalSearch__upperC${expandSearch ? ' expandedBar' : ''}${
        stuck ? ' stuckBar' : ''
      }`}
      style={{ ...style }}
      ref={searchContainerRef}
    >
      <div
        style={expandSearch ? { display: 'none' } : {}}
        className='GlobalSearch__searchContainer nameAndProfilePic'
      >
        <div>
          <img
            src={`${
              process.env.NODE_ENV === 'development' ? YCIcon : branding.branding.client_logo
            }`}
            className='img-fluid mx-1 mr-1'
            alt='profile'
            width='27px'
            height='27px'
          />
          <SearchIcon style={{ width: '20px', marginLeft: '5px' }} />
        </div>
        <div className='searchInputContainer'>
          <input className='searchBarInputOnDashboard' type='text' placeholder='Search' />
          <div className='vl'> </div>
          {/* eslint-disable */}
          <img
            src={profileImage || userAvatar}
            width='27px'
            height='27px'
            alt='profile'
            onClick={() => expandSearchBar()}
            className='ml-1 mx-1'
          />
        </div>
      </div>
      <div style={!expandSearch ? { display: 'none' } : {}} className='avatarAnimation'>
        <img
          src={profileImage || userAvatar}
          width='27px'
          height='27px'
          alt='profile'
          onClick={() => goToProfile()}
          className='ml-1 mx-1'
        />
        <p className='mb-0 ml-2 nameText'>
          {firstName} {lastName}
        </p>
      </div>

      <div
        onClick={() => expandSearchBar()}
        style={!expandSearch ? { display: 'none' } : {}}
        className='crossIcon'
      >
        <CancelIcon stylle={{ color: 'rgba(128,128,128,0.5' }} />
      </div>

      <div className='barBtns'>
        <button onClick={goToProfile} type='button'>
          <SettingsIcon
            style={{
              marginRight: '10px',
            }}
          />
          Settings
        </button>
        <button onClick={logoutHandler} style={{ color: 'red' }} type='button'>
          <LogoutIcon
            style={{
              marginRight: '10px',
            }}
          />
          Log out
        </button>
      </div>
      <div className='expandedBottom'>
        <hr />
        <div className='d-flex justify-content-around w-100'>
          <p className='verySmallSearchBarText'>
            <GavelIcon
              style={{
                marginRight: '5px',
                width: '15px',
              }}
            />
            Terms and Conditions
          </p>
          <p className='verySmallSearchBarText'>
            <ShieldIcon
              style={{
                marginRight: '5px',
                width: '15px',
              }}
            />
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    branding: getCurrentBranding(state),
    userProfile: getUserProfile(state),
    clientUserId: getClientUserId(state),
    roleArray: getRoleArray(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearClientIdDetails: () => {
      dispatch(clientUserIdActions.clearClientIdDetails());
    },
    clearProfile: () => {
      dispatch(userProfileActions.clearUserProfile());
    },
    setFirstTimeLoginToStore: () => {
      dispatch(firstTimeLoginActions.setFirstTimeLoginToStore());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobarSearchBar);

GlobarSearchBar.propTypes = {
  clientUserId: PropTypes.number.isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
  branding: PropTypes.instanceOf(Object).isRequired,
  userProfile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    profileImage: PropTypes.string,
  }).isRequired,
  style: PropTypes.instanceOf(Object),
  setFirstTimeLoginToStore: PropTypes.func.isRequired,
  clearProfile: PropTypes.func.isRequired,
  clearClientIdDetails: PropTypes.func.isRequired,
};

GlobarSearchBar.defaultProps = {
  style: {},
};
