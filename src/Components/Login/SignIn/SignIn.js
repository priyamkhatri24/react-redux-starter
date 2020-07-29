import React, { useEffect } from 'react';
import jumboImage from '../../../assets/images/yourCoachingHeavy.png';

const SignIn = (props) => {
  useEffect(() => {
    const nibs = props.location.state.userInfo;
    console.log('hello', nibs);
  }, []);

  return (
    <div className='text-center Signin'>
      <img src={jumboImage} alt='coachingLogo' className='Signin__jumbo' />
      {props.location.state.userInfo.map((elem) => (
        <div>{elem.username}</div>
      ))}
      <div>hi</div>
    </div>
  );
};

export default SignIn;
