import React, { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import Button from 'react-bootstrap/Button';
import { useInterval } from '../../../Utilities';
import './SignUp.scss';

const SignUp = () => {
  const [otp, setOtp] = useState('');
  const [count, setCount] = useState(15);
  const [resend, setResend] = useState(false);

  const ContainerStyle = {
    alignItems: 'center',
    justifyContent: 'center',
  };

  const inputStyle = {
    width: '3rem',
    margin: '1.5rem',
    borderTopStyle: 'none',
    borderRightStyle: 'none',
    borderLeftStyle: 'none',
    borderBottomColor: '#2699FB',
  };

  useInterval(() => {
    if (count <= 0) {
      setResend(true);
      return;
    }
    setCount(count - 1);
  }, 1000);

  useEffect(() => {
    //  const nibs = props.location.state.contact;
    // console.log('hello', nibs);
  }, []);

  const handleClick = () => console.log('lol');

  return (
    <div className='text-center Signup'>
      <p className='Signup__heading  mx-4'>
        Enter the 4-digit one time password we have sent you on
      </p>
      <p className='Signup__mobile mb-5'>+91-8452990246</p>
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
        <p className='Signup__resend mt-5'>Resend?</p>
      ) : (
        <p className='Signup__timer mt-5'>
          Resend OTP in 0:
          <span>{count}</span>
        </p>
      )}
      <Button
        variant='custom'
        disabled={!(otp.length === 4)}
        onClick={otp.length === 4 ? handleClick : null}
      >
        Verify
      </Button>
      <div>{otp}</div>
    </div>
  );
};

export default SignUp;
