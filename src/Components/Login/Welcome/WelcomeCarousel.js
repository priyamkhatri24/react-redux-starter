import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import Button from 'react-bootstrap/Button';
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper/core';
import loadable from '@loadable/component';

import './Welcome.scss';

// Import Swiper styles
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/navigation/navigation.min.css';

// import Swiper core and required modules
import { getCurrentBranding } from '../../../redux/reducers/branding.reducer';
import carouselFirst from '../../../assets/images/Login/carousel1.svg';
import carouselSecond from '../../../assets/images/Login/carousel2.svg';
import carouselThird from '../../../assets/images/Login/carousel3.svg';
import { useInterval } from '../../../Utilities';

// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Navigation]);

const WelcomeCarousel = (props) => {
  const { changeComponent, currentbranding } = props;
  const [buttonFont, setButtonFont] = useState(18);
  // useInterval(() => {
  //   if (buttonFont <= 19) {
  //     setButtonFont(buttonFont++);
  //     return;
  //   } else {
  //     setButtonFont(17)
  //     return;
  //   }
  // }, 3000);

  return (
    <>
      <Button
        variant='customSkip'
        className='Welcome__skip'
        onClick={() => changeComponent('Dummy')}
      >
        Skip
      </Button>

      <h5 className='Welcome__carouselSubHeading text-center'>Welcome to</h5>
      <h3 className='Welcome__carouselHeading text-center mb-3 mt-4'>
        {currentbranding.branding.client_name}
      </h3>
      <Swiper
        spaceBetween={30}
        centeredSlides
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        className='mySwiper'
      >
        {[
          { key: 1, text: 'Learn anytime, anywhere', image: carouselFirst },
          { key: 2, text: 'Practice online', image: carouselSecond },
          { key: 3, text: 'Track your progress', image: carouselThird },
        ].map((elem) => {
          // setButtonFont(buttonFont + elem.key);
          return (
            <SwiperSlide key={elem.key}>
              <div className='d-flex justify-content-center'>
                <img src={elem.image} alt='Carousel' className='Welcome__imageCarousel' />
              </div>
              <p className='mt-4 text-center Welcome__carouselText'>{elem.text}</p>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <Button
        variant='JumboLogin'
        onClick={() => changeComponent('PhoneNo')}
        style={{ zIndex: '999', fontSize: `${buttonFont}px`, marginBottom: '8px' }}
      >
        Log In / Sign Up
      </Button>
    </>
  );
};

const mapStateToProps = (state) => ({
  currentbranding: getCurrentBranding(state),
});

export default connect(mapStateToProps)(WelcomeCarousel);

WelcomeCarousel.propTypes = {
  changeComponent: PropTypes.func.isRequired,
  currentbranding: PropTypes.instanceOf(Object).isRequired,
};
