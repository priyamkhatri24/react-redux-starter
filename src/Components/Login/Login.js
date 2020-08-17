import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './Login.scss';
import Preloader from './Preloader/Preloader';
import footerIngenium from '../../assets/images/ingiLOGO.png';
import PhoneNo from './PhoneNo/PhoneNo';
import { post } from '../../Utilities/Remote';
import {
  getCurrentBranding,
  getBrandingError,
  getBrandingPending,
} from '../../redux/reducers/branding.reducer';
import getBranding from './Login.service';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentComponent: 'Preloader',
      image: null,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.handleComponent('PhoneNo');
    }, 6000);
    const domain = { domain_name: window.location.hostname };
    const { fetchBranding } = this.props;
    fetchBranding(domain);
  }

  componentDidUpdate(prevprops) {
    const {
      currentbranding: {
        pending,
        branding: { client_logo: image },
      },
    } = this.props;

    if (prevprops.currentbranding.pending !== pending && pending === false) {
      this.setState({ image });
    }
  }

  handleComponent = (param) => {
    this.setState({ currentComponent: param });
  };

  getPhoneNo = (param) => {
    const requestBody = {
      contact: param,
      client_id: this.props.currentbranding.branding.client_id,
      // contact: '7999583681',
    };

    post(requestBody, '/enterNumberAndLogin')
      .then((res) => {
        console.log(res);
        if (res.result.is_user === true) {
          this.goToLoginOrSignUp('signin', requestBody.contact, res.result.user_info);
        } else {
          this.goToLoginOrSignUp('signup', requestBody.contact);
        }
      })
      .catch((e) => console.error(e));
  };

  goToLoginOrSignUp(path, contact, payload = null) {
    const {
      history: { push },
    } = this.props;
    const { image } = this.state;

    if (path === 'signup') {
      push({
        pathname: '/signup',
        state: { contact },
      });
    } else {
      push({
        pathname: '/signin',
        state: { userInfo: payload, image, contact },
      });
    }
  }

  render() {
    const { currentComponent, image } = this.state;

    return (
      <div className='text-center Login'>
        <img src={image} alt='coachingLogo' className='Login__jumbo' />

        {currentComponent === 'Preloader' && <Preloader />}

        {currentComponent === 'PhoneNo' && (
          <PhoneNo getData={this.getPhoneNo} placeholder='Mobile number' />
        )}

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

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,

  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      client_id: PropTypes.number,
      client_logo: PropTypes.string,
    }),
    pending: PropTypes.bool.isRequired,
  }).isRequired,

  fetchBranding: PropTypes.func.isRequired,
};
