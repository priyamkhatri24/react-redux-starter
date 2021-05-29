import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { LoginDetailsSkeleton, OTPInput } from '../../../Common';
import passwordImage from '../../../../assets/images/Login/password.svg';
import './ForgotPassword.scss';
import { get, post, apiValidation } from '../../../../Utilities';
import { userProfileActions } from '../../../../redux/actions/userProfile.action';
import { firstTimeLoginActions } from '../../../../redux/actions/firsttimeLogin.action';
import { clientUserIdActions } from '../../../../redux/actions/clientUserId.action';

const ForgotPassword = (props) => {
  const [resendText, setResendText] = useState('Resend?');
  const [currentComponent, setComponent] = useState('otp');
  const [newPassword, setNewPassword] = useState('');
  const [verify, setVerify] = useState(false);

  const {
    location: {
      state: { contact, loginParams, userStatus },
    },
    history,
    setFirstTimeLoginToStore,
  } = props;

  const verifyOTP = (otp) => {
    const requestBody = {
      user_id: loginParams.user_id,
      phone_number: contact,
      filled_otp: otp,
    };

    console.log(loginParams);
    get(requestBody, '/verifyOTP')
      .then((res) => {
        console.log(res);
        const result = apiValidation(res, 'msg');
        console.log(result);
        if (result.verification_status === 'wrong otp entered') {
          alert('Invalid OTP!');
        } else if (result.verification_status === 'otp verified') {
          setComponent('createPassword');
        }
      })
      .catch((e) => console.error(e));
  };

  const resendOtp = () => {
    const requestBody = {
      user_id: loginParams.user_id,
      contact,
    };
    post(requestBody, '/resendOTP')
      .then((res) => {
        if (res.success === 1) {
          setResendText('Sent!');
        } else if (res.success === 0) {
          setResendText('Resend Failed. Try again?');
        }
      })
      .catch((e) => console.error(e));
  };

  const getPassword = () => {
    if (userStatus === 'active') {
      const reqBody = {
        user_name: loginParams.user_name,
        password: newPassword,
        client_id: loginParams.clientId,
      };
      setVerify(true);
      get(reqBody, '/loginUser')
        .then((res) => {
          const { push } = props.history;
          const result = apiValidation(res);

          if (result.status === 'Wrong password. Login failed') {
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
          push({ pathname: '/' });
          setFirstTimeLoginToStore(true);
        })
        .catch((err) => console.log(err));
    } else if (userStatus === 'pending') {
      console.log('brooo');
      console.log(loginParams);
      const payload = {
        user_name: loginParams.user_name,
        password: newPassword,
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
          props.history.push({ pathname: '/' });
          setFirstTimeLoginToStore(true);
        }
      });
    }
  };

  const resetPassword = () => {
    const requestBody = {
      user_id: loginParams.user_id,
      password: newPassword,
    };

    post(requestBody, '/changePassword')
      .then((res) => {
        console.log(res);
        if (res.success) {
          //    history.push('/login'); // login user api
          //   getPass(newPassword);

          getPassword(newPassword);
        }
      }) // navigate to dashboard
      .catch((e) => console.error(e));
  };

  return (
    <div>
      {currentComponent === 'otp' && (
        <OTPInput
          contact={contact}
          resendOtp={resendOtp}
          verifyOTP={verifyOTP}
          resendText={resendText}
        />
      )}

      {currentComponent === 'createPassword' && (
        // <div style={{ marginTop: '150px' }}>
        //   <img
        //     src={image}
        //     alt='coachingLogo'
        //     className='Signin__jumbo img-fluid rounded mx-auto d-block'
        //   />

        //   <PhoneNo placeholder='Password' getData={resetPassword} password status='pending' />
        // </div>
        <LoginDetailsSkeleton
          placeholder='Password'
          image={passwordImage}
          heading='Reset Password'
          setClick={resetPassword}
          password
          status='pending'
          value={newPassword}
          setValue={setNewPassword}
          isVerify={verify}
        />
      )}
    </div>
  );
};

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
    setFirstTimeLoginToStore: (payload) => {
      dispatch(firstTimeLoginActions.setFirstTimeLoginToStore(payload));
    },
  };
};

export default connect(null, mapDispatchToProps)(ForgotPassword);

ForgotPassword.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      image: PropTypes.string.isRequired,
      userId: PropTypes.number,
      contact: PropTypes.string.isRequired,
      userStatus: PropTypes.string.isRequired,
      loginParams: PropTypes.instanceOf(Object).isRequired,
    }),
  }).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  setCLientUserIdToStore: PropTypes.func.isRequired,
  setUserIdToStore: PropTypes.func.isRequired,
  setUserUserIdToStore: PropTypes.func.isRequired,
  setRoleArrayToStore: PropTypes.func.isRequired,
  setFirstNameToStore: PropTypes.func.isRequired,
  setLastNameToStore: PropTypes.func.isRequired,
  setProfileImageToStore: PropTypes.func.isRequired,
  setContactToStore: PropTypes.func.isRequired,
  setTokenToStore: PropTypes.func.isRequired,
  setClientIdToStore: PropTypes.func.isRequired,
  setUserNameToStore: PropTypes.func.isRequired,
  setFirstTimeLoginToStore: PropTypes.func.isRequired,
};
