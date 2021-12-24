import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
// import ProgressBar from 'react-bootstrap/ProgressBar';
import TextLoop from 'react-text-loop';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import footerIngenium from '../../../assets/images/ingiLOGO.png';
import { changeFaviconAndDocumentTitle, setGlobalColors, useInterval } from '../../../Utilities';
import { getBranding, getColor } from '../Login.service';
import './Preloader.scss';
import '../Login.scss';
import { getCurrentBranding } from '../../../redux/reducers/branding.reducer';
import ProgressBar from '../../Common/ProgressBar/ProgressBar';

const Preloader = (props) => {
  const { fetchColors, fetchBranding, currentBranding, history } = props;
  const [count, setCount] = useState(0);
  const [image, setImage] = useState(footerIngenium);
  useInterval(() => {
    if (count >= 100) {
      return;
    }
    setCount((counter) => counter + 1);
  }, 20);

  const setClientColors = useCallback(
    (color = 'hsl(208, 96.4%, 56.7%)') => {
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
    },
    [fetchColors],
  );

  useEffect(() => {
    const domain =
      process.env.NODE_ENV === 'development'
        ? { domain_name: 'abcd.ingeniumedu.com' }
        : { domain_name: window.location.hostname };

    fetchBranding(domain);
  }, [fetchBranding]);

  useEffect(() => {
    const { branding } = currentBranding;
    if (!currentBranding.pending) {
      setImage(branding.client_logo);
      if (branding.client_color) setClientColors(branding.client_color);
      else setClientColors();
      changeFaviconAndDocumentTitle(branding.client_icon, branding.client_name);
    }
  }, [currentBranding, setClientColors]);

  useEffect(() => {
    if (count === 100) {
      setTimeout(() => {
        setCount(0);
        history.replace('/login');
      }, 1000);
    }
  }, [count, history]);

  const hello = ['Hello', 'Dumantis', 'Bonjour', 'Namaskar'];

  return (
    <div className='text-center Login'>
      <img
        src={image}
        alt='coachingLogo'
        style={{ background: 'transparent' }}
        className='Login__jumbo'
      />

      <div className='Preloader mx-auto '>
        <h5 className='Preloader__hello mx-lg-3 mt-lg-3 mb-lg-0 m-5 p-lg-5'>HELLO!</h5>
        <h6 style={{ fontFamily: 'Montserrat-Regular' }} className='m-lg-4 m-5 text-center'>
          <TextLoop mask='true' interval={1000}>
            {hello}
          </TextLoop>
        </h6>

        {/* <ProgressBar now={count} label={`${count}%`} max={100} /> */}
        <ProgressBar width={`${count}%`} height='15px' />
      </div>
      <footer className='py-4 Login__footer '>
        <h6 className='Login__footerText'>Powered By</h6>
        <img src={footerIngenium} alt='footerLogo' className='deskWidth' />
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentBranding: getCurrentBranding(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchBranding: getBranding,
      fetchColors: getColor,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Preloader);

Preloader.propTypes = {
  fetchColors: PropTypes.func.isRequired,
  fetchBranding: PropTypes.func.isRequired,
  currentBranding: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};
