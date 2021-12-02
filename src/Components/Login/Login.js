import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './Login.scss';
import loadable from '@loadable/component';
import Preloader from './Preloader/Preloader';
import footerIngenium from '../../assets/images/ingiLOGO.png';
import {
  post,
  // get,
  // apiValidation,
  // setGlobalColors,
  // changeFaviconAndDocumentTitle,
} from '../../Utilities';
import {
  getCurrentBranding,
  getBrandingError,
  getBrandingPending,
  getCurrentComponent,
} from '../../redux/reducers/branding.reducer';
import { getContact } from './Login.service';
import WelcomeCarousel from './Welcome/WelcomeCarousel';
// import SignupForm from './SignupForm';
// import DummyDashboard from './DummyDashboard';
// import EnterPhone from './EnterPhone';

// const WelcomeCarousel = loadable(() => import('./Welcome/WelcomeCarousel'));
const SignupForm = loadable(() => import('./SignupForm'));
const DummyDashboard = loadable(() => import('./DummyDashboard'));
const EnterPhone = loadable(() => import('./EnterPhone'));

class Login extends Component {
  constructor(props) {
    const { currentComponent } = props;
    super(props);
    this.state = {
      currentComponent: currentComponent || 'Welcome',
      image: null,
    };
  }

  componentDidMount() {
    const { currentComponent, currentbranding, history } = this.props;
    if (!Object.keys(currentbranding.branding).length) {
      history.replace('/');
    }
    console.log(currentComponent);
    // const domain =
    //   process.env.NODE_ENV === 'development'
    //     ? { domain_name: 'abcd.ingeniumedu.com' }
    //     : { domain_name: window.location.hostname };
    // const { fetchBranding } = this.props;
    // fetchBranding(domain);
  }

  // componentDidUpdate(prevprops) {
  //   const {
  //     currentbranding: {
  //       pending,
  //       branding: {
  //         client_logo: image,
  //         client_id: clientId,
  //         client_color: clientColor,
  //         client_icon: clientIcon,
  //         client_title: clientTitle,
  //       },
  //     },
  //   } = this.props;

  //   if (prevprops.currentbranding.pending !== pending && pending === false) {
  //     this.setState({ image });

  //     this.setClientColors(clientColor);

  //     changeFaviconAndDocumentTitle(clientIcon, clientTitle);

  //     const request = {
  //       client_id: clientId,
  //     };

  //     setTimeout(() => {
  //       get(request, '/getAdsForClient')
  //         .then((res) => {
  //           const result = apiValidation(res);

  //           if (result.is_ad === 'true') {
  //             this.handleComponent('Welcome');
  //           } else {
  //             this.handleComponent('Welcome');
  //           }
  //         })
  //         .catch(() => this.handleComponent('Welcome'));
  //     }, 3000);
  //   }
  // }

  // setClientColors = (color = 'hsl(208, 96.4%, 56.7%)') => {
  //   const { fetchColors } = this.props;

  //   const init = color.indexOf('(');
  //   const fin = color.indexOf(')');
  //   const colorValues = color.substr(init + 1, fin - init - 1).split(',');
  //   const lightSaturation = (parseFloat(colorValues[1]) * 0.6).toFixed(2);
  //   const lighterSaturation = (parseFloat(colorValues[1]) * 0.3).toFixed(2);
  //   const lightestSaturation = (parseFloat(colorValues[1]) * 0.08).toFixed(2);

  //   const lightcolorString = `hsl(${colorValues[0]},${lightSaturation}%,${colorValues[2]})`;
  //   const lightercolorString = `hsl(${colorValues[0]},${lighterSaturation}%,${colorValues[2]})`;
  //   const lightestcolorString = `hsl(${colorValues[0]},${lightestSaturation}%,${colorValues[2]})`;

  //   setGlobalColors(color, lightcolorString, lightercolorString, lightestcolorString);

  //   const colorVariables = {
  //     primary: color,
  //     light: lightcolorString,
  //     lighter: lightercolorString,
  //     superLight: lightestcolorString,
  //   };

  //   fetchColors(colorVariables);
  // };

  handleComponent = (param) => {
    this.setState({ currentComponent: param });
  };

  getPhoneNo = (param, countryCode = null) => {
    const {
      currentbranding: {
        branding: { client_id: clientId },
      },
      fetchContact,
    } = this.props;
    const requestBody = {
      contact: param,
      client_id: clientId,
      country_code: countryCode,
    };

    fetchContact(param, countryCode);

    post(requestBody, '/enterNumberAndLoginLatest')
      .then((res) => {
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
      this.setState({ currentComponent: 'SignupForm' });
      // push({
      //   pathname: '/signup',
      //   state: { contact },
      // });
    } else {
      push({
        pathname: '/signin',
        state: { userInfo: payload, image, contact },
      });
    }
  }

  render() {
    const { currentComponent, image } = this.state;
    const {
      history,
      currentbranding: {
        branding: { client_id: clientId },
      },
    } = this.props;

    return (
      <>
        {currentComponent === 'Preloader' && (
          <div className='text-center Login'>
            <img src={image} alt='coachingLogo' className='Login__jumbo' />

            {currentComponent === 'Preloader' && <Preloader />}

            <footer className='py-4 Login__footer '>
              <h6 className='Login__footerText'>Powered By</h6>
              <img src={footerIngenium} alt='footerLogo' className='w-25' />
            </footer>
          </div>
        )}

        {currentComponent === 'PhoneNo' && (
          // <PhoneNo getData={this.getPhoneNo} placeholder='Mobile number' />
          <EnterPhone getData={this.getPhoneNo} placeholder='Mobile number' />
        )}

        {currentComponent === 'Welcome' && (
          // <Welcome data={welcomeData} changeComponent={this.handleComponent} />
          <WelcomeCarousel changeComponent={this.handleComponent} />
        )}

        {currentComponent === 'SignupForm' && (
          // <Welcome data={welcomeData} changeComponent={this.handleComponent} />
          <SignupForm history={history} changeComponent={this.handleComponent} />
        )}

        {currentComponent === 'Dummy' && (
          // <Welcome data={welcomeData} changeComponent={this.handleComponent} />
          <DummyDashboard
            clientId={clientId}
            history={history}
            changeComponent={this.handleComponent}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  error: getBrandingError(state),
  currentbranding: getCurrentBranding(state),
  pending: getBrandingPending(state),
  currentComponent: getCurrentComponent(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      // fetchBranding: getBranding,
      // fetchColors: getColor,
      fetchContact: getContact,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Login);

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,

  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      client_id: PropTypes.number,
      client_logo: PropTypes.string,
      client_color: PropTypes.string,
      client_icon: PropTypes.string,
      client_title: PropTypes.string,
    }),
    pending: PropTypes.bool.isRequired,
  }).isRequired,

  // fetchBranding: PropTypes.func.isRequired,
  // fetchColors: PropTypes.func.isRequired,
  fetchContact: PropTypes.func.isRequired,
  currentComponent: PropTypes.string.isRequired,
};
