import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LoginDetailsSkeleton, OTPInput } from '../../../Common';
import PhoneNo from '../../PhoneNo/PhoneNo';
import passwordImage from '../../../../assets/images/Login/password.svg';
import './ForgotPassword.scss';
import { get, post, apiValidation } from '../../../../Utilities';

const ForgotPassword = (props) => {
  const [resendText, setResendText] = useState('Resend?');
  const [currentComponent, setComponent] = useState('otp');
  const [newPassword, setNewPassword] = useState('');
  const [verify, setVerify] = useState(false);

  const {
    location: {
      state: { image, userId, contact },
    },
    history,
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

  const resetPassword = () => {
    const requestBody = {
      user_id: userId,
      password: newPassword,
    };

    post(requestBody, '/changePassword')
      .then((res) => {
        console.log(res);
        if (res.success) {
          history.push('/login');
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
          heading='Create Password'
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

export default ForgotPassword;

ForgotPassword.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      image: PropTypes.string.isRequired,
      userId: PropTypes.number,
      contact: PropTypes.string.isRequired,
    }),
  }).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};
