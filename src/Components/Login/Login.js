import React from 'react';
import './Login.scss';
import Preloader from './Preloader/Preloader';
import jumboImage from '../../assets/images/yourCoachingHeavy.png';
import footerIngenium from '../../assets/images/ingiLOGO.png';

function Login() {
  return (
    <div className='mt-5 text-center Login'>
      <img src={jumboImage} alt='coachingLogo' className='Login__jumbo' />
      <Preloader />

      <footer id='sticky-footer' className='py-4 footer fixed-bottom mb-5 '>
        <h6 className='Login__footerText'>Powered By</h6>
        <img src={footerIngenium} alt='footerLogo' className='w-25' />
      </footer>
    </div>
  );
}

export default Login;
