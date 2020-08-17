import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentBranding } from '../../../redux/reducers/branding.reducer';
import { post, get, apiValidation } from '../../../Utilities';
import { OTPInput } from '../../Common';

const SignUp = (props) => {
  const [resendText, setResendText] = useState('Resend?');

  const {
    location: {
      state: { contact },
    },
    currentbranding: { branding: { client_id: clientId = '' } = {} } = {},
  } = props;

  const verifyOTP = (otp) => {
    const requestBody = {
      client_id: clientId,
      phone_number: contact,
      filled_otp: otp,
    };
    get(requestBody, '/verifyLoginOTP')
      .then((res) => {
        const result = apiValidation(res);

        if (result.verification_status === 'wrong otp entered') {
          alert('Invalid OTP!');
        } else if (result.verification_status === 'otp expired') {
          alert('OTP expired');
        } else if (result.verification_status === 'otp verified') {
          const { user_status: userStatus, user_id: userId } = result;
          const { push } = props.history;

          if (userStatus === 'visitor') {
            push({
              pathname: '/admission',
              state: { userId },
            });
          } else if (userStatus === 'admission') {
            push({
              pathname: '/admissionform',
              state: { userId },
            });
          }
        } else if (res.success === 0) {
          alert('Unable to reach the server. Please check your internet connection');
        }
      })
      .catch((e) => console.error(e));
  };

  const resendOtp = () => {
    const requestBody = {
      client_id: clientId,
      contact,
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
        contact={contact}
        resendOtp={resendOtp}
        verifyOTP={verifyOTP}
        resendText={resendText}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentbranding: getCurrentBranding(state),
});

export default connect(mapStateToProps)(SignUp);

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
};

SignUp.defaultProps = {
  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      client_id: null,
    }),
  }),
};
