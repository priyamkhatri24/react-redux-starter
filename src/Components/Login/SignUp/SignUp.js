import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { getCurrentBranding } from '../../../redux/reducers/branding.reducer';
import { post, get, apiValidation } from '../../../Utilities';
import { OTPInput } from '../../Common';
import { clientUserIdActions } from '../../../redux/actions/clientUserId.action';
import { getUserProfile } from '../../../redux/reducers/userProfile.reducer';

const SignUp = (props) => {
  const [resendText, setResendText] = useState('Resend?');

  const {
    userProfile,
    currentbranding: { branding: { client_id: clientId = '' } = {} } = {},
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

          if (userStatus === 'visitor') {
            push({
              pathname: '/admission',
              state: { userId },
            });
          } else if (userStatus === 'inquiry') {
            push({
              pathname: '/admissionform',
              state: { userId },
            });
          } else if (userStatus === 'admission') {
            Swal.fire({
              icon: 'success',
              text:
                'Thank You for filling the admission form. Please wait while the institute approves your information',
            }).then((response) => {
              if (response.isConfirmed) {
                push('/login');
              }
            });
          }
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

  return (
    <div className='text-center'>
      <OTPInput
        contact={userProfile.contact}
        resendOtp={resendOtp}
        verifyOTP={verifyOTP}
        resendText={resendText}
      />
    </div>
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
    setUserIdToStore: (payload) => {
      dispatch(clientUserIdActions.setUserIdToStore(payload));
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
};

SignUp.defaultProps = {
  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      client_id: null,
    }),
  }),
};
