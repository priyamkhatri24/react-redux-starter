import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'react-responsive-carousel';
import { history } from '../../Routing';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../Login/Welcome/Welcome.scss';
import './Fees.scss';

const FeeCarousel = (props) => {
  const { carouselObject, currencySymbol } = props;
  const [carouselDetails, setCarouseletails] = useState([]);

  useEffect(() => {
    if (Object.keys(carouselObject).length > 0) {
      const carouselArray = [
        {
          key: 1,
          style: {
            boxshadow: '0px 6px 12px 0px rgba(0, 0, 0, 0.16)',
            backGround: 'linear-gradient(107deg, rgba(174,0,0,0.24) 0%, rgba(174,0,0,1) 100%)',
          },
          heading: `${carouselObject.month} Collection`,
          amount: carouselObject.monthly_paid_amount
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        },

        {
          key: 2,
          style: {
            boxshadow: '0px 6px 12px 0px rgba(0, 0, 0, 0.16)',
            backGround:
              'linear-gradient(107deg, rgba(194,194,194,0.24) 0%, rgba(194,194,194,1) 100%)',
          },
          heading: `${carouselObject.month} Due`,
          amount: carouselObject.monthly_due_amount
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        },
        {
          key: 3,
          style: {
            boxshadow: '0px 6px 12px 0px rgba(0, 0, 0, 0.16)',
            backGround: 'linear-gradient(107deg, rgba(255,179,0,0.24) 0%, rgba(255,179,0,1) 100%)',
          },
          heading: `${carouselObject.year} Collection`,
          amount: carouselObject.annual_paid_amount
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        },
      ];
      setCarouseletails(carouselArray);
    }
  }, [carouselObject]);

  const goToSettlementPage = () => {
    history.push({ pathname: '/teacherfees/settlementaccout' });
  };

  return (
    <div>
      <button
        type='submit'
        style={{
          width: '100%',
          backgroundColor: 'white',
          border: ' 0.001px #f5f5dc solid',
          marginBottom: '10px',
          borderRadius: '2px',
          color: '#86c87b',
          fontFamily: 'Montserrat-Medium',
          fontSize: '16px',
        }}
        onClick={goToSettlementPage}
      >
        View settlement account details
      </button>
      <Carousel
        autoPlay
        showThumbs
        showArrows
        showIndicators
        transitionTime={400}
        dynamicHeight
        infiniteLoop
        className='pb-2 mb-2'
      >
        {carouselDetails.length &&
          carouselDetails.map((elem) => {
            return (
              <div
                key={elem.key}
                style={{
                  boxShadow: elem.style.boxshadow,
                  background: elem.style.backGround,
                  borderRadius: '10px',
                  display: 'flex',
                }}
                className='mx-auto Fees__carouselCard'
              >
                <span
                  className='my-auto mx-3 Fees__carouselIcon'
                  style={{
                    fontSize: '104px',
                    lineHeight: '127px',
                    fontFamily: 'Montserrat-Bold',
                    opacity: '0.2',
                  }}
                >
                  {currencySymbol}
                </span>
                <div className='ml-auto m-4 Fees__carouselText'>
                  <p
                    style={{
                      fontFamily: 'Montserrat-Medium',
                      fontSize: '14px',
                      lineHeight: '10px',
                      textAlign: 'right',
                      paddingTop: '16px',
                    }}
                  >
                    {elem.heading}
                  </p>
                  <p
                    style={{
                      textAlign: 'right',
                      fontFamily: 'Montserrat-Light',
                      fontSize: '38px',
                      lineHeight: ' 47px',
                    }}
                  >
                    {elem.amount}
                  </p>
                </div>
              </div>
            );
          })}
      </Carousel>
    </div>
  );
};

export default FeeCarousel;

FeeCarousel.propTypes = {
  carouselObject: PropTypes.instanceOf(Object).isRequired,
  currencySymbol: PropTypes.string.isRequired,
};
