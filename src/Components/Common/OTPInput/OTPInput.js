import React, { useState } from 'react';
import PropTypes from 'prop-types';
import OtpInput from 'react-otp-input';
import Button from 'react-bootstrap/Button';
import { useInterval } from '../../../Utilities';
import './OTPInput.scss';

export const OTPInput = (props) => {
  const [otp, setOtp] = useState('');
  const [count, setCount] = useState(60);
  const [resend, setResend] = useState(false);

  const { contact, resendOtp, verifyOTP, resendText, countryCode } = props;

  const ContainerStyle = {
    alignItems: 'center',
    justifyContent: 'center',
  };

  const inputStyle = {
    width: '3rem',
    margin: '1rem',
    borderTopStyle: 'none',
    borderRightStyle: 'none',
    borderLeftStyle: 'none',
    borderBottomColor: 'var(--primary-blue)',
  };

  useInterval(() => {
    if (count <= 0) {
      setResend(true);
      return;
    }
    setCount(count - 1);
  }, 1000);

  return (
    <div className='text-center OTPInput'>
      <p className='OTPInput__heading  mx-4'>
        Enter the 4-digit one time password we have sent you on
      </p>
      <p className='OTPInput__mobile mb-5'>
        +{countryCode}-{contact}
      </p>
      <OtpInput
        value={otp}
        onChange={(e) => setOtp(e)}
        numInputs={4}
        separator={<span>-</span>}
        isInputNum
        containerStyle={ContainerStyle}
        inputStyle={inputStyle}
        // focusStyle={}
      />
      {resend ? (
        <p>
          <span
            className='OTPInput__resend mt-5'
            onClick={() => resendOtp()}
            onKeyDown={() => resendOtp()}
            role='button'
            tabIndex='-1'
          >
            {resendText}
          </span>
        </p>
      ) : (
        <p className='OTPInput__timer mt-5'>
          Resend OTP in 0:
          {count < 10 ? '0' : null}
          <span>{count}</span>
        </p>
      )}
      <div className='justify-content-center mx-4 pb-3'>
        <Button
          variant='loginPrimary'
          disabled={!(otp.length === 4)}
          onClick={otp.length === 4 ? () => verifyOTP(otp) : null}
        >
          Verify
        </Button>
      </div>
    </div>
  );
};

OTPInput.propTypes = {
  resendOtp: PropTypes.func.isRequired,
  verifyOTP: PropTypes.func.isRequired,
  resendText: PropTypes.string.isRequired,
  contact: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
};
