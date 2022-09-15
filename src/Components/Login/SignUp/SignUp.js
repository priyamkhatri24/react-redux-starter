import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { getCurrentBranding } from '../../../redux/reducers/branding.reducer';
import { post, get } from '../../../Utilities/Remote';
import { apiValidation } from '../../../Utilities';
import { LoginDetailsSkeleton, OTPInput } from '../../Common';
import { clientUserIdActions } from '../../../redux/actions/clientUserId.action';
import { getUserProfile } from '../../../redux/reducers/userProfile.reducer';
import passwordImage from '../../../assets/images/Login/password.svg';
import { userProfileActions } from '../../../redux/actions/userProfile.action';
import { firstTimeLoginActions } from '../../../redux/actions/firsttimeLogin.action';

const SignUp = (props) => {
  const [resendText, setResendText] = useState('Resend?');
  const [currentComponent, setCurrentComponent] = useState('OTP');
  const [newPassword, setNewPassword] = useState('');
  const [verify, setVerify] = useState(false);
  const [user, setUser] = useState({});
  const [loginParams, setLoginParams] = useState({ user_id: 0, user_name: '', password: '' });

  const {
    userProfile,
    currentbranding: { branding: { client_id: clientId = '' } = {} } = {},
    setFirstTimeLoginToStore,
    history,
  } = props;

  const verifyOTP = (otp) => {
    const requestBody = {
      client_id: clientId,
      phone_number: userProfile.contact,
      filled_otp: otp,
      country_code: userProfile.countryCode,
      first_name: userProfile.firstName,
      last_name: userProfile.lastName,
      profile_image: userProfile.profileImage,
      email: userProfile.email,
    };
    get(requestBody, '/verifyLoginOTPLatest')
      .then((res) => {
        const result = apiValidation(res);
        if (result.verification_status === 'wrong otp entered') {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Invalid OTP',
          });
        } else if (result.verification_status === 'otp expired') {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'The OTP has expired. Click resend to get a new OTP',
          });
        } else if (result.verification_status === 'otp verified') {
          const { user_status: userStatus, user_id: userId, client_user_id: clientUserId } = result;
          props.setUserIdToStore(userId);
          props.setCLientUserIdToStore(clientUserId);
          const { push } = props.history;

          if (userStatus === 'pending') {
            setCurrentComponent('Create');
            const resp = apiValidation(res);
            setUser(resp);
            setLoginParams({ ...loginParams, user_id: resp.user_id, user_name: resp.username });
          }

          // if (userStatus === 'visitor') {
          //   push({
          //     pathname: '/admission',
          //     state: { userId },
          //   });
          // } else if (userStatus === 'inquiry') {
          //   push({
          //     pathname: '/admissionform',
          //     state: { userId },
          //   });
          // } else if (userStatus === 'admission') {
          //   Swal.fire({
          //     icon: 'success',
          //     text:
          //    'Thank You for filling the admission form. Please wait while the institute approves your information',
          //   }).then((response) => {
          //     if (response.isConfirmed) {
          //       push('/login');
          //     }
          //   });
          // }
        } else if (res.success === 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Unable to reach the server. Please check your internet connection',
          });
        }
      })
      .catch((e) => console.error(e));
  };

  const resendOtp = () => {
    const requestBody = {
      client_id: clientId,
      contact: userProfile.contact,
      email: userProfile.email,
      country_code: userProfile.countryCode,
    };
    post(requestBody, '/resendOTPForCRM')
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
            birthday,
            address,
            gender,
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
  };

  const createPassword = () => {
    const payload = {
      user_name: user.username,
      user_id: user.user_id,
      password: newPassword,
    };

    post(payload, '/signupAfterOtp').then((res) => {
      console.log(res);
      if (res.success) {
        getPassword();
      }
    });
  };

  return (
    <>
      {currentComponent === 'OTP' && (
        <div className='text-center'>
          <OTPInput
            contact={userProfile.contact}
            resendOtp={resendOtp}
            verifyOTP={verifyOTP}
            resendText={resendText}
            countryCode={userProfile.countryCode}
            email={userProfile.email}
          />
        </div>
      )}

      {currentComponent === 'Create' && (
        <LoginDetailsSkeleton
          placeholder='Password'
          image={passwordImage}
          heading='Create Password'
          setClick={createPassword}
          password
          status='pending'
          value={newPassword}
          setValue={setNewPassword}
          isVerify={verify}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  currentbranding: getCurrentBranding(state),
  userProfile: getUserProfile(state),
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
    setFirstTimeLoginToStore: (payload) => {
      dispatch(firstTimeLoginActions.setFirstTimeLoginToStore(payload));
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

SignUp.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      contact: PropTypes.string.isRequired,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      client_id: PropTypes.number,
    }),
  }),

  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,

  setUserIdToStore: PropTypes.func.isRequired,
  setCLientUserIdToStore: PropTypes.func.isRequired,
  userProfile: PropTypes.instanceOf(Object).isRequired,
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
  setBirthdayToStore: PropTypes.func.isRequired,
  setAddressToStore: PropTypes.func.isRequired,
  setGenderToStore: PropTypes.func.isRequired,
};

SignUp.defaultProps = {
  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      client_id: null,
    }),
  }),
};
