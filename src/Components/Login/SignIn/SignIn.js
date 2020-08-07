import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PhoneNo from '../PhoneNo/PhoneNo';
import footerIngenium from '../../../assets/images/ingiLOGO.png';
import './SignIn.scss';
import { getCurrentBranding } from '../../../redux/reducers/branding.reducer';
import { get } from '../../../Utilities';

const SignIn = (props) => {
  const {
    location: {
      state: { image, userInfo },
    },
  } = props;

  const { currentbranding: { branding: { client_id = '' } = {} } = {} } = props;

  const [currentComponent, setComponent] = useState('username');
  const [validUser, checkValidUser] = useState(false);
  const [loginParams, setLoginParams] = useState({
    user_name: '',
    clientId: client_id,
  });
  const [userStatus, setUserStatus] = useState('');

  const getUserName = (param) => {
    console.log(loginParams, 'loginparams');
    const userParam = userInfo.filter((e) => {
      return e.username === param;
    });
    if (userParam && userParam.length) {
      setComponent('password');
      setLoginParams((prevState) => {
        return { ...prevState, user_name: userParam[0].username };
      });
      checkValidUser(false);
      setUserStatus(userParam[0].user_status);
    } else {
      checkValidUser(true);
    }
  };

  const getPassword = (param) => {
    console.log(loginParams);

    if (userStatus === 'active') {
      const reqBody = {
        user_name: loginParams.user_name,
        password: param,
        client_id: loginParams.clientId,
      };

      get(reqBody, '/loginUser')
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    } else if (userStatus === 'pending') {
      console.log('brooo');
    }
  };

  return (
    <div className='text-center Signin'>
      <img src={image} alt='coachingLogo' className='Signin__jumbo' />
      {currentComponent === 'username' && <PhoneNo placeholder='username' getData={getUserName} />}

      {currentComponent === 'password' && (
        <PhoneNo placeholder='Password' getData={getPassword} password status={userStatus} />
      )}
      {validUser && (
        <small className='text-danger d-block'>
          Please enter a valid
          {currentComponent}
        </small>
      )}
      <footer id='sticky-footer' className='py-4 footer fixed-bottom mb-5 '>
        <h6 className='Login__footerText'>Powered By</h6>
        <img src={footerIngenium} alt='footerLogo' className='w-25' />
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentbranding: getCurrentBranding(state),
});

export default connect(mapStateToProps)(SignIn);

SignIn.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      image: PropTypes.string,
      userInfo: PropTypes.array.isRequired,
    }),
  }),

  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      client_id: PropTypes.number.isRequired,
    }),
  }),
};

SignIn.defaultProps = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      image: '',
    }),
  }),
};
