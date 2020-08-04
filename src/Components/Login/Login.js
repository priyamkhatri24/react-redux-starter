import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Login.scss';
import Preloader from './Preloader/Preloader';
import footerIngenium from '../../assets/images/ingiLOGO.png';
import PhoneNo from './PhoneNo/PhoneNo';
import { post } from '../../Utilities/Remote';
import { connect } from 'react-redux';
import {
  getCurrentBranding,
  getBrandingError,
  getBrandingPending,
} from '../../redux/reducers/branding.reducer';
import getBranding from './Login.service';
import { bindActionCreators } from 'redux';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentComponent: 'Preloader',
      userInfo: '',
      image: null,
      pending: this.props.currentbranding.pending,
    };
  }

  componentDidUpdate(prevprops) {
    if (
      prevprops.currentbranding.pending !== this.props.currentbranding.pending &&
      this.props.currentbranding.pending === false
    ) {
      this.setState({ image: this.props.currentbranding.branding.client_logo });
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.handleComponent('PhoneNo');
    }, 6000);
    const domain = { domain_name: window.location.hostname };
    const { fetchBranding } = this.props;
    fetchBranding(domain);
  }

  handleComponent = (param) => {
    this.setState({ currentComponent: param });
  };

  getPhoneNo = (param) => {
    const requestBody = {
      // contact: param,
      client_id: this.props.currentbranding.branding.client_id,
      contact: '7999583681',
    };

    post(requestBody, '/enterNumberAndLogin')
      .then((res) => {
        if (res.result.is_user === true) {
          this.setState({ userInfo: res.result.user_info });
          this.handleComponent('SignIn');
          //      this.goToLogin();
        } else {
          this.handleComponent('SignUp');
        }
      })
      .catch((e) => console.error(e));
  };

  goToLoginOrSignUp() {
    console.log(this.state, 'signin state', this.props, 'singin props');
    // return <Redirect push to={{ pathname: '/signin' }} />;
    this.props.history.push('/signin');
  }
  render() {
    const { currentComponent, userInfo, image } = this.state;

    if (currentComponent === 'SignIn') {
      return <Redirect push to={{ pathname: '/signin', state: { userInfo, image } }} />;
    } else if (currentComponent === 'SignUp') {
      return <Redirect push to={{ pathname: '/signup', state: { image } }} />;
    }

    return (
      <div className='text-center Login'>
        <img src={image} alt='coachingLogo' className='Login__jumbo' />

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

const mapStateToProps = (state) => ({
  error: getBrandingError(state),
  currentbranding: getCurrentBranding(state),
  pending: getBrandingPending(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchBranding: getBranding,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Login);
