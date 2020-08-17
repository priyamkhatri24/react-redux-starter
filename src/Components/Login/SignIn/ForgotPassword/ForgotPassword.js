import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { OTPInput } from '../../../Common';
import PhoneNo from '../../PhoneNo/PhoneNo';
import './ForgotPassword.scss';
import { get, post, apiValidation } from '../../../../Utilities';

const ForgotPassword = (props) => {
  const [resendText, setResendText] = useState('Resend?');
  const [currentComponent, setComponent] = useState('otp');

  const {
    location: {
      state: { image, userId, contact },
    },
  } = props;

  const verifyOTP = (otp) => {
    const requestBody = {
      user_id: userId,
      phone_number: contact,
      filled_otp: otp,
    };
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
      user_id: userId,
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

  const resetPassword = (param) => {
    console.log(param);
    const requestBody = {
      user_id: userId,
      password: param,
    };

    post(requestBody, '/changePassword')
      .then((res) => console.log(res)) // navigate to dashboard
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
        <div style={{ marginTop: '150px' }}>
          <img
            src={image}
            alt='coachingLogo'
            className='Signin__jumbo img-fluid rounded mx-auto d-block'
          />

          <PhoneNo placeholder='Password' getData={resetPassword} password status='pending' />
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;

ForgotPassword.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      image: PropTypes.string.isRequired,
      userId: PropTypes.number,
      contact: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
