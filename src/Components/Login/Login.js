import React, { Component } from 'react';
import './Login.scss';
import Preloader from './Preloader/Preloader';
import jumboImage from '../../assets/images/yourCoachingHeavy.png';
import footerIngenium from '../../assets/images/ingiLOGO.png';
import PhoneNo from './PhoneNo/PhoneNo';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentComponent: 'Preloader',
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.handleComponent('PhoneNo');
    }, 6000);
  }

  handleComponent = (param) => {
    this.setState({ currentComponent: param });
  };

  getPhoneNo = (param) => {
    console.log(param);
  };

  render() {
    const { currentComponent } = this.state;
    return (
      <div className='text-center Login'>
        <img src={jumboImage} alt='coachingLogo' className='Login__jumbo' />
        {currentComponent === 'Preloader' && <Preloader />}

        {currentComponent === 'PhoneNo' && <PhoneNo getPhoneNo={this.getPhoneNo} />}

        <footer id='sticky-footer' className='py-4 footer fixed-bottom mb-5 '>
          <h6 className='Login__footerText'>Powered By</h6>
          <img src={footerIngenium} alt='footerLogo' className='w-25' />
        </footer>
      </div>
    );
  }
}

export default Login;
