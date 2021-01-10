import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './Login.scss';
import Preloader from './Preloader/Preloader';
import footerIngenium from '../../assets/images/ingiLOGO.png';
import PhoneNo from './PhoneNo/PhoneNo';
import {
  post,
  get,
  apiValidation,
  setGlobalColors,
  changeFaviconAndDocumentTitle,
} from '../../Utilities';
import {
  getCurrentBranding,
  getBrandingError,
  getBrandingPending,
} from '../../redux/reducers/branding.reducer';
import { getBranding, getColor } from './Login.service';
import Welcome from './Welcome/Welcome';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentComponent: 'Preloader',
      image: null,
      welcomeData: null,
    };
  }

  componentDidMount() {
    const domain = { domain_name: 'portal.tca.ingeniumedu.com' }; // { domain_name: window.location.hostname };
    // const domain = { domain_name: window.location.hostname }; // { domain_name: window.location.hostname };

    const { fetchBranding } = this.props;
    fetchBranding(domain);
  }

  componentDidUpdate(prevprops) {
    const {
      currentbranding: {
        pending,
        branding: {
          client_logo: image,
          client_id: clientId,
          client_color: clientColor,
          client_icon: clientIcon,
          client_title: clientTitle,
        },
      },
    } = this.props;

    if (prevprops.currentbranding.pending !== pending && pending === false) {
      this.setState({ image });

      this.setClientColors(clientColor);

      changeFaviconAndDocumentTitle(clientIcon, clientTitle);

      const request = {
        client_id: clientId,
      };

      setTimeout(() => {
        get(request, '/getAdsForClient')
          .then((res) => {
            const result = apiValidation(res);

            if (result.is_ad) {
              this.setState({ welcomeData: result });
              this.handleComponent('Welcome');
            } else {
              this.handleComponent('PhoneNo');
            }
          })
          .catch(() => this.handleComponent('PhoneNo'));
      }, 3000);
    }
  }

  setClientColors = (color = 'hsl(208, 96.4%, 56.7%)') => {
    const { fetchColors } = this.props;

    const init = color.indexOf('(');
    const fin = color.indexOf(')');
    const colorValues = color.substr(init + 1, fin - init - 1).split(',');
    const lightSaturation = (parseFloat(colorValues[1]) * 0.6).toFixed(2);
    const lighterSaturation = (parseFloat(colorValues[1]) * 0.3).toFixed(2);
    const lightestSaturation = (parseFloat(colorValues[1]) * 0.08).toFixed(2);

    const lightcolorString = `hsl(${colorValues[0]},${lightSaturation}%,${colorValues[2]})`;
    const lightercolorString = `hsl(${colorValues[0]},${lighterSaturation}%,${colorValues[2]})`;
    const lightestcolorString = `hsl(${colorValues[0]},${lightestSaturation}%,${colorValues[2]})`;

    setGlobalColors(color, lightcolorString, lightercolorString, lightestcolorString);

    const colorVariables = {
      primary: color,
      light: lightcolorString,
      lighter: lightercolorString,
      superLight: lightestcolorString,
    };

    fetchColors(colorVariables);
  };

  handleComponent = (param) => {
    this.setState({ currentComponent: param });
  };

  getPhoneNo = (param) => {
    const {
      currentbranding: {
        branding: { client_id: clientId },
      },
    } = this.props;
    const requestBody = {
      contact: param,
      client_id: clientId,
    };

    post(requestBody, '/enterNumberAndLogin')
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
    const { currentComponent, image, welcomeData } = this.state;

    return (
      <>
        {currentComponent !== 'Welcome' && (
          <div className='text-center Login'>
            <img src={image} alt='coachingLogo' className='Login__jumbo' />

            {currentComponent === 'Preloader' && <Preloader />}

            {currentComponent === 'PhoneNo' && (
              <PhoneNo getData={this.getPhoneNo} placeholder='Mobile number' />
            )}

            <footer className='py-4 Login__footer '>
              <h6 className='Login__footerText'>Powered By</h6>
              <img src={footerIngenium} alt='footerLogo' className='w-25' />
            </footer>
          </div>
        )}

        {currentComponent === 'Welcome' && (
          <Welcome data={welcomeData} changeComponent={this.handleComponent} />
        )}
      </>
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
      fetchColors: getColor,
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
      client_color: PropTypes.string,
      client_icon: PropTypes.string,
      client_title: PropTypes.string,
    }),
    pending: PropTypes.bool.isRequired,
  }).isRequired,

  fetchBranding: PropTypes.func.isRequired,
  fetchColors: PropTypes.func.isRequired,
};
