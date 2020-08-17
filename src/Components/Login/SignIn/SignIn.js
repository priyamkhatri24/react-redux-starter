import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PhoneNo from '../PhoneNo/PhoneNo';
import footerIngenium from '../../../assets/images/ingiLOGO.png';
import './SignIn.scss';
import { getCurrentBranding } from '../../../redux/reducers/branding.reducer';
import { get, post, apiValidation } from '../../../Utilities';

const SignIn = (props) => {
  const {
    location: {
      state: { image, userInfo, contact },
    },
  } = props;

  const { currentbranding: { branding: { client_id: clientId = '' } = {} } = {} } = props;

  const [currentComponent, setComponent] = useState('username');
  const [validUser, checkValidUser] = useState(false);
  const [loginParams, setLoginParams] = useState({
    user_name: '',
    clientId,
    user_id: 0,
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
        return { ...prevState, user_name: userParam[0].username, user_id: userParam[0].user_id };
      });
      checkValidUser(false);
      setUserStatus(userParam[0].user_status);
    } else {
      checkValidUser(true);
    }
  };

  const forgotUsername = () => {
    const { push } = props.history;
    const requestBody = {
      contact,
      client_id: loginParams.clientId,
    };

    post(requestBody, '/forgotUsername')
      .then((res) => {
        const result = apiValidation(res);
        if (result.status === 'Wrong username') {
          alert('Please Check your Internet Connection');
          push({ pathname: '/' });
        } else if (result === 'success') {
          alert('The Username Has been sent to your registered mobile number');
        }
      })
      .catch((e) => console.error(e));
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
          const result = apiValidation(res);
          if (result.status === 'Wrong password. Login failed') {
            checkValidUser(true);
          }
          console.log(res);
        })
        .catch((err) => console.log(err));
    } else if (userStatus === 'pending') {
      console.log('brooo');
    }
  };

  const forgotPassword = () => {
    const { push } = props.history;
    console.log(loginParams);
    const requestBody = {
      user_id: loginParams.user_id,
      contact,
    };

    post(requestBody, '/resendOTP')
      .then((res) => {
        const result = apiValidation(res);
        if (result.status === 'sending successful') {
          push({
            pathname: '/forgotpassword',
            state: { image, contact, userId: loginParams.user_id },
          });
        } else {
          alert('Please Check Your Internet Connection');
        }
      })
      .catch((e) => console.err(e));
  };

  return (
    <div className='Signin text-center'>
      <img
        src={image}
        alt='coachingLogo'
        className='Signin__jumbo img-fluid rounded mx-auto d-block'
      />

      {currentComponent === 'username' && (
        <PhoneNo placeholder='username' getData={getUserName} forgotPlaceholder={forgotUsername} />
      )}

      {currentComponent === 'password' && (
        <PhoneNo
          placeholder='Password'
          getData={getPassword}
          password
          status={userStatus}
          forgotPlaceholder={forgotPassword}
        />
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
      contact: PropTypes.string.isRequired,
    }),
  }),

  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      client_id: PropTypes.number.isRequired,
    }),
  }),

  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

SignIn.defaultProps = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      image: '',
    }),
  }),

  currentbranding: {},
};
