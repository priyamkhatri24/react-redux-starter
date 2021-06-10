import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import PhoneNo from '../PhoneNo/PhoneNo';
import footerIngenium from '../../../assets/images/ingiLOGO.png';
import './SignIn.scss';
import { getCurrentBranding } from '../../../redux/reducers/branding.reducer';
import { get, post } from '../../../Utilities/Remote';
import { apiValidation } from '../../../Utilities';
import { clientUserIdActions } from '../../../redux/actions/clientUserId.action';
import { userProfileActions } from '../../../redux/actions/userProfile.action';
import { firstTimeLoginActions } from '../../../redux/actions/firsttimeLogin.action';
import { getFirstTimeLoginState } from '../../../redux/reducers/firstTimeLogin.reducer';
import SelectUser from './SelectUser';
import passwordImage from '../../../assets/images/Login/password.svg';
import { LoginDetailsSkeleton } from '../../Common';

const SignIn = (props) => {
  const {
    location: {
      state: { image, userInfo, contact },
    },
    firstTimeLogin,
    setFirstTimeLoginToStore,
    history,
  } = props;

  const { currentbranding: { branding: { client_id: clientId = '' } = {} } = {} } = props;
  const [password, setPassword] = useState('');
  const [verify, setVerify] = useState(false);
  const [currentComponent, setComponent] = useState('username');
  const [validUser, checkValidUser] = useState(false);
  const [loginParams, setLoginParams] = useState({
    user_name: '',
    clientId,
    user_id: 0,
  });
  const [userStatus, setUserStatus] = useState('');

  useEffect(() => {
    // checks whether the user is logged for the first time only
    if (firstTimeLogin) history.push('/');
  }, [firstTimeLogin, history]);

  const getUserName = (param) => {
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

  // const forgotUsername = () => {
  //   const { push } = props.history;
  //   const requestBody = {
  //     contact,
  //     client_id: loginParams.clientId,
  //   };

  //   post(requestBody, '/forgotUsername')
  //     .then((res) => {
  //       const result = apiValidation(res);
  //       if (result.status === 'Wrong username') {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Oops!',
  //           text: `Please check your internet connection.`,
  //         });
  //         push({ pathname: '/login' });
  //       } else if (result === 'success') {
  //         Swal.fire({
  //           icon: 'success',
  //           title: 'Success!',
  //           text: `The Username Has been sent to your registered mobile number`,
  //         });
  //       }
  //     })
  //     .catch((e) => console.error(e));
  // };

  const getPassword = (pass = null) => {
    if (userStatus === 'active') {
      const reqBody = {
        user_name: loginParams.user_name,
        password,
        client_id: loginParams.clientId,
      };
      setVerify(true);
      get(reqBody, '/loginUser')
        .then((res) => {
          const { push } = props.history;
          const result = apiValidation(res);

          if (result.status === 'Wrong password. Login failed') {
            checkValidUser(true);
            setVerify(false);
          }

          const {
            token,
            user: {
              client_user_id: clientUserId,
              client_client_id: clientID,
              contact: userContact,
              first_name: firstName,
              role_array: roleArray,
              last_name: lastName,
              user_user_id: userUserId,
              user_id: userId,
              profile_image: profileImage,
              username: userName,
              birthday,
              gender,
              address,
            },
          } = result;
          console.log(result, userName, result.user);

          props.setCLientUserIdToStore(clientUserId);
          props.setUserIdToStore(userId);
          props.setUserUserIdToStore(userUserId);
          props.setRoleArrayToStore(roleArray);
          props.setFirstNameToStore(firstName);
          props.setLastNameToStore(lastName);
          props.setProfileImageToStore(profileImage);
          props.setContactToStore(userContact);
          props.setTokenToStore(token);
          props.setClientIdToStore(clientID);
          props.setUserNameToStore(userName);
          props.setBirthdayToStore(birthday);
          props.setAddressToStore(address);
          props.setGenderToStore(gender);

          push({ pathname: '/' });
          setFirstTimeLoginToStore(true);
        })
        .catch((err) => console.log(err));
    } else if (userStatus === 'pending') {
      console.log('brooo');
      console.log(loginParams);
      console.log(password);
      const payload = {
        user_name: loginParams.user_name,
        password,
        user_id: loginParams.user_id,
      };

      post(payload, '/signupAfterOtpForWeb').then((res) => {
        const result = apiValidation(res);

        if (result.status === 'signup successful') {
          const {
            token,
            user: {
              client_user_id: clientUserId,
              client_client_id: clientID,
              contact: userContact,
              first_name: firstName,
              role_array: roleArray,
              last_name: lastName,
              user_user_id: userUserId,
              user_id: userId,
              profile_image: profileImage,
              username: userName,
              gender,
              address,
              birthday,
            },
          } = result;

          props.setCLientUserIdToStore(clientUserId);
          props.setUserIdToStore(userId);
          props.setUserUserIdToStore(userUserId);
          props.setRoleArrayToStore(roleArray);
          props.setFirstNameToStore(firstName);
          props.setLastNameToStore(lastName);
          props.setProfileImageToStore(profileImage);
          props.setContactToStore(userContact);
          props.setTokenToStore(token);
          props.setClientIdToStore(clientID);
          props.setUserNameToStore(userName);
          props.setBirthdayToStore(birthday);
          props.setAddressToStore(address);
          props.setGenderToStore(gender);
          props.history.push({ pathname: '/' });
          setFirstTimeLoginToStore(true);
        }
      });
    }
  };

  const forgotPassword = () => {
    const { push } = props.history;
    console.log(loginParams);
    const requestBody = {
      user_id: loginParams.user_id,
      contact,
    };

    post(requestBody, '/resendOTP').then((res) => {
      const result = apiValidation(res);
      if (result.status === 'sending successful') {
        push({
          pathname: '/forgotpassword',
          state: { image, contact, userId: loginParams.user_id, loginParams, userStatus },
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: `Please check your internet connection.`,
        });
      }
    });
    // .catch((e) => console.err(e));
  };

  return (
    <>
      {currentComponent === 'username' && (
        <>
          <img
            src={image}
            alt='coachingLogo'
            className='Signin__jumbo img-fluid rounded mx-auto d-block'
            style={{ marginTop: '125px' }}
          />

          <SelectUser userInfo={userInfo} getUserName={getUserName} />
        </>
      )}

      {currentComponent === 'password' && userStatus === 'active' && (
        <LoginDetailsSkeleton
          placeholder='Password'
          image={passwordImage}
          heading='Enter Password'
          setClick={getPassword}
          password
          forgotPlaceholder={forgotPassword}
          value={password}
          setValue={setPassword}
          isVerify={verify}
        />
      )}

      {currentComponent === 'password' && userStatus === 'pending' && (
        <LoginDetailsSkeleton
          placeholder='Password'
          image={passwordImage}
          heading='Create Password'
          setClick={getPassword}
          password
          status='pending'
          value={password}
          setValue={setPassword}
          isVerify={verify}
        />
      )}

      {validUser && (
        <small className='text-danger d-block text-center mx-auto'>
          Please enter a valid {currentComponent}
        </small>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  currentbranding: getCurrentBranding(state),
  firstTimeLogin: getFirstTimeLoginState(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setCLientUserIdToStore: (payload) => {
      dispatch(clientUserIdActions.setCLientUserIdToStore(payload));
    },
    setClientIdToStore: (payload) => {
      dispatch(clientUserIdActions.setClientIdToStore(payload));
    },
    setUserIdToStore: (payload) => {
      dispatch(clientUserIdActions.setUserIdToStore(payload));
    },
    setUserUserIdToStore: (payload) => {
      dispatch(clientUserIdActions.setUserUserIdToStore(payload));
    },
    setRoleArrayToStore: (payload) => {
      dispatch(clientUserIdActions.setRoleArrayToStore(payload));
    },
    setFirstNameToStore: (payload) => {
      dispatch(userProfileActions.setFirstNameToStore(payload));
    },
    setLastNameToStore: (payload) => {
      dispatch(userProfileActions.setLastNameToStore(payload));
    },
    setContactToStore: (payload) => {
      dispatch(userProfileActions.setContactToStore(payload));
    },
    setProfileImageToStore: (payload) => {
      dispatch(userProfileActions.setProfileImageToStore(payload));
    },
    setUserNameToStore: (payload) => {
      dispatch(userProfileActions.setUserNameToStore(payload));
    },
    setTokenToStore: (payload) => {
      dispatch(userProfileActions.setTokenToStore(payload));
    },
    setBirthdayToStore: (payload) => {
      dispatch(userProfileActions.setBirthdayToStore(payload));
    },
    setGenderToStore: (payload) => {
      dispatch(userProfileActions.setGenderToStore(payload));
    },
    setAddressToStore: (payload) => {
      dispatch(userProfileActions.setAddressToStore(payload));
    },

    setFirstTimeLoginToStore: (payload) => {
      dispatch(firstTimeLoginActions.setFirstTimeLoginToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);

SignIn.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      image: PropTypes.string,
      userInfo: PropTypes.instanceOf(Array),
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

  setCLientUserIdToStore: PropTypes.func.isRequired,
  setUserIdToStore: PropTypes.func.isRequired,
  setUserUserIdToStore: PropTypes.func.isRequired,
  setRoleArrayToStore: PropTypes.func.isRequired,
  setFirstNameToStore: PropTypes.func.isRequired,
  setLastNameToStore: PropTypes.func.isRequired,
  setProfileImageToStore: PropTypes.func.isRequired,
  setContactToStore: PropTypes.func.isRequired,
  setTokenToStore: PropTypes.func.isRequired,
  setBirthdayToStore: PropTypes.func.isRequired,
  setAddressToStore: PropTypes.func.isRequired,
  setGenderToStore: PropTypes.func.isRequired,
  setClientIdToStore: PropTypes.func.isRequired,
  setUserNameToStore: PropTypes.func.isRequired,
  firstTimeLogin: PropTypes.bool.isRequired,
  setFirstTimeLoginToStore: PropTypes.func.isRequired,
};

SignIn.defaultProps = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      image: '',
    }),
  }),

  currentbranding: {},
};
