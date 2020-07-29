import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Login.scss';
import Preloader from './Preloader/Preloader';
import jumboImage from '../../assets/images/yourCoachingHeavy.png';
import footerIngenium from '../../assets/images/ingiLOGO.png';
import PhoneNo from './PhoneNo/PhoneNo';
import { post } from '../../Utilities/Remote';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentComponent: 'Preloader',
      userInfo: '',
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
    const requestBody = {
      // client_id: param,
      client_id: '3',
      contact: '7999583681',
    };

    post(requestBody, '/enterNumberAndLogin')
      .then((res) => {
        if (res.result.is_user === true) {
          this.setState({ userInfo: res.result.user_info });
          this.handleComponent('SignIn');
        }
      })
      .catch((e) => console.error(e));
  };

  render() {
    const { currentComponent, userInfo } = this.state;

    if (currentComponent === 'SignIn') {
      return <Redirect to={{ pathname: '/signIn', state: { userInfo } }} />;
    }

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
