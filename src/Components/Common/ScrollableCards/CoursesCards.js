import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import './ScrollableCards.scss';
import Row from 'react-bootstrap/Row';
import StarIcon from '@material-ui/icons/Star';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { get, apiValidation } from '../../../Utilities';
import ProgressBar from '../ProgressBar/ProgressBar';
import coursesBoy from '../../../assets/images/Courses/coursesBoy.svg';
import rupee from '../../../assets/images/Courses/rupee.svg';
import YCIcon from '../../../assets/images/Courses/thumbnail.png';

export const CoursesCards = (props) => {
  const {
    allCourses,
    myCourses,
    goToCourse,
    buyCourseId,
    myCourseId,
    clientLogo,
    featureName,
    country,
    state,
    globalCurrency,
    noViewAllButton,
  } = props;

  const [currencyCodes, setCurrencyCodes] = useState([]);
  const [colors, setColors] = useState([
    '#d4a373',
    '#f08080',
    '#a0c4ff',
    '#abc4ff',
    '#84dcc6',
    '#b388eb',
    '#a7bed3',
    '#e7cee3',
    '#e4b4c2',
    '#fcd29f',
    '#d2e0bf',
  ]);

  useEffect(() => {
    get(null, '/getAllCurrencyCodes').then((res) => {
      const result = apiValidation(res);
      result.forEach((ele) => (ele.currencySymbol = ele.currency_symbol));
      setCurrencyCodes(result);
    });
  }, []);

  return (
    <>
      {allCourses.length > 0 && (
        <section className='Scrollable__courseCard mt-3' style={{ marginLeft: 0, marginRight: 0 }}>
          <div className='Scrollable__subHeadTextUnderHeading'>
            <div className='d-flex justify-content-between w-100'>
              <h5 className='Scrollable__coursesInitialHeading mb-1'>{featureName}</h5>
              {allCourses.length >= 4 && !noViewAllButton ? (
                <button
                  className='Scrollable__viewAllButtonForCards mb-0'
                  type='button'
                  onClick={() => goToCourse('allCourses')}
                >
                  View All <ChevronRightIcon />
                </button>
              ) : null}
            </div>
            {featureName.toLowerCase() === 'courses' ? (
              <p className='smallTextUnderHeading text-left'>
                Top quality digital courses in your hands. Get them NOW!
              </p>
            ) : null}
          </div>
          <div style={{ display: 'flex', marginTop: '100px' }} className='desktopDisplayforCards'>
            {allCourses.map((elem) => {
              let totalRating = 0;
              let calculatedRating = 0;
              if (elem.reviews?.length) {
                const reviewsArary = elem.reviews[0];
                for (let i = 0; i < reviewsArary.length; i++) {
                  totalRating += Number(reviewsArary[i].rating);
                }

                calculatedRating = totalRating / reviewsArary.length;
              }

              // elem.currencySymbol = '₹'; // default
              if (elem.is_regional) {
                const countryFilteredPrices = elem.prices_array.filter(
                  (ele) => ele.country_name === country,
                );
                const checkForAllStates = countryFilteredPrices.find(
                  (ele) => ele.state_name === '',
                );
                const checkForCurrentState = countryFilteredPrices.find(
                  (ele) => ele.state_name === state,
                );

                if (checkForAllStates) {
                  elem.course_price = checkForAllStates.region_course_price;
                  elem.discount_price = checkForAllStates.region_discount_price;
                  elem.currencySymbol = currencyCodes.find(
                    (ele) => ele.currency_code === checkForAllStates.currency_code,
                  )?.currencySymbol;
                }
                if (checkForCurrentState) {
                  elem.course_price = checkForCurrentState.region_course_price;
                  elem.discount_price = checkForCurrentState.region_discount_price;
                  elem.currencySymbol = currencyCodes.find(
                    (ele) => ele.currency_code === checkForCurrentState.currency_code,
                  )?.currencySymbol;
                }
              }
              const numberOfStars = Math.round(parseInt(Math.floor(calculatedRating), 10));
              const starArray = [...Array(numberOfStars)].map((e, i) => (
                /* eslint-disable-next-line */
                <span role='img' aria-label='emoji' key={i}>
                  <StarIcon className='Scrollable__emoji' />
                </span>
              ));

              const normalStars = 5 - numberOfStars;

              const whiteStarArray = [...Array(normalStars)].map((e, i) => (
                /* eslint-disable-next-line */
                <span role='img' aria-label='emoji' key={i}>
                  <StarBorderIcon className='Scrollable__emoji' />
                </span>
              ));

              return (
                <div
                  className='course-card'
                  style={{ paddingLeft: 0, paddingRight: 0 }}
                  key={`elem+${elem.course_id}`}
                >
                  <Card
                    className='Scrollable__courseCardContent text-center mt-8'
                    key={`elem+${elem.course_id}`}
                    onClick={() => buyCourseId(elem.course_id)}
                  >
                    <div
                      style={
                        elem.course_display_image
                          ? { position: 'relative' }
                          : {
                              position: 'relative',
                              backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                              borderRadius: '10px 10px 0px 0px',
                            }
                      }
                    >
                      <img
                        src={elem.course_display_image ? elem.course_display_image : YCIcon}
                        alt='student'
                        style={!elem.course_display_image ? { width: 'auto' } : {}}
                        className='mx-auto
                Scrollable__courseImage'
                      />
                      <div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          bottom: 0,
                          backgroundImage: 'linear-gradient(transparent, #44444484)',
                        }}
                      >
                        {elem.reviews?.length && elem.allow_reviews === 'true' ? (
                          <Row className='mx-0 px-2 pb-1 d-flex align-items-center'>
                            {starArray.map((e) => {
                              return e;
                            })}
                            {whiteStarArray.map((e) => {
                              return e;
                            })}
                            <span className='Scrollable__smallText Scrollable__negativeMargin my-0 ml-1'>
                              {String(calculatedRating).slice(0, 3)}
                            </span>
                            <span className='Scrollable__smallText Scrollable__negativeMargin my-0 ml-1'>
                              ({elem.reviews[0].length})
                            </span>
                          </Row>
                        ) : (
                          <p className='Scrollable__noReviewsText'>No reviews yet</p>
                        )}
                      </div>
                    </div>
                    <p className='Scrollable__courseCardHeading mt-3 mb-0 mx-2'>
                      {elem.course_title.length > 48
                        ? `${elem.course_title.slice(0, 45)}...`
                        : elem.course_title}
                    </p>
                    <p className='Scrollable__courseCardSubHeading text-left mx-2'>
                      {elem.currencySymbol ? (
                        <span className='mx-1 Scrollable__courseCardHeading'>
                          {elem.currencySymbol}
                        </span>
                      ) : (
                        // <img src={rupee} alt='rupee' height='10' width='10' />
                        <span className='mx-1 Scrollable__courseCardHeading'>{globalCurrency}</span>
                      )}

                      <span className='mx-1 Scrollable__courseCardHeading'>
                        {elem.discount_price}
                      </span>
                      <span className='strictInline'>
                        <del>{elem.course_price}</del>
                      </span>
                    </p>
                    {elem.bestseller_tag && (
                      <div className='Scrollable__bestSeller m-2 p-1'>Bestseller</div>
                    )}
                  </Card>
                </div>
              );
            })}
            {/* <div className='col-sm-6 col-md-4 col-lg-2' style={{ paddingLeft: 0, paddingRight: 0 }}>
              <Card
                className='Scrollable__courseCardContent text-center justify-content-center align-items-center'
                onClick={() => goToCourse('allCourses')}
                style={{ height: '246px' }}
              >
                <span className='Scrollable__viewAll'>View All</span>
              </Card>
            </div> */}
          </div>
        </section>
      )}
      {myCourses.length > 0 && (
        <>
          <div className='Scrollable__subHeadTextUnderHeading'>
            <div className='d-flex justify-content-between w-100'>
              <h5 className='mt-4 mb-0 Scrollable__coursesInitialHeading mx-0 row'>
                My {featureName}
              </h5>
              {myCourses.length >= 4 ? (
                <button
                  className='Scrollable__viewAllButtonForCards'
                  type='button'
                  onClick={() => goToCourse('myCourses')}
                >
                  View All <ChevronRightIcon />
                </button>
              ) : null}
            </div>
          </div>
          <div className='conatiner'>
            <section
              className='d-flex Scrollable__card my-3 desktopDisplayforCards'
              style={{ minWidth: '95%' }}
            >
              {myCourses.map((elem) => {
                const numberOfStars = Math.round(parseInt(elem.course_rating, 10));
                const starArray = [...Array(numberOfStars)].map((e, i) => (
                  /* eslint-disable-next-line */
                  <span role='img' aria-label='emoji' key={i}>
                    <StarIcon className='Scrollable__emoji' />
                  </span>
                ));

                const normalStars = 5 - numberOfStars;

                const whiteStarArray = [...Array(normalStars)].map((e, i) => (
                  /* eslint-disable-next-line */
                  <span role='img' aria-label='emoji' key={i}>
                    <StarBorderIcon className='Scrollable__emoji' />
                  </span>
                ));

                return (
                  <div
                    className='course-card'
                    style={{
                      paddingLeft: 0,
                      paddingRight: 0,
                      marginTop: '45px',
                    }}
                  >
                    <Card
                      className='Scrollable__courseCardContent text-center'
                      key={`elem+${elem.course_id}`}
                      onClick={() => myCourseId(elem.course_id)}
                    >
                      <div
                        style={
                          elem.course_display_image
                            ? { position: 'relative' }
                            : {
                                position: 'relative',
                                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                                borderRadius: '10px 10px 0px 0px',
                              }
                        }
                      >
                        <img
                          src={elem.course_display_image ? elem.course_display_image : YCIcon}
                          alt='student'
                          style={!elem.course_display_image ? { width: 'auto' } : {}}
                          className='mx-auto Scrollable__courseImage'
                        />
                        {/* <div style={{ position: 'absolute', bottom: 0 }}>
                          <Row className='mx-2'>
                            {starArray.map((e) => {
                              return e;
                            })}
                            {whiteStarArray.map((e) => {
                              return e;
                            })}
                            <span className='Scrollable__smallText my-auto'>
                              {elem.course_rating}
                            </span>
                            <span className='Scrollable__smallText my-auto'>
                              ({elem.total_votes})
                            </span>
                          </Row>
                        </div> */}
                      </div>
                      <p className='Scrollable__courseCardHeading mt-3 mb-0 mx-2'>
                        {elem.course_title.length > 48
                          ? `${elem.course_title.slice(0, 45)}...`
                          : elem.course_title}
                      </p>
                      <div
                        style={{ width: '90%', position: 'absolute', bottom: '10px' }}
                        className='d-flex align-items-center'
                      >
                        <ProgressBar
                          width={`${elem.completed_percentage || 0}%`}
                          height='2px'
                          borderRadius='100px'
                          customStyle={{
                            backgroundColor: '#4154cf',
                            height: '2px',
                            borderRadius: '100px',
                          }}
                          myProgressCustomStyle={{
                            width: '85%',
                            height: '2px',
                            margin: '15px auto 5px auto',
                            backgroundColor: 'rgba(0,0,0,0.42)',
                          }}
                        />
                        <p
                          style={{
                            fontSize: '10px',
                            fontFamily: 'Montserrat-Regular',
                            marginBottom: '0px',
                            marginTop: '5px',
                          }}
                        >
                          {elem.completed_percentage ? elem.completed_percentage.toFixed(0) : 0}%
                        </p>
                      </div>
                      {/* <p className='Scrollable__courseCardSubHeading text-left mx-2'>
                        <img src={rupee} alt='rupee' height='10' width='10' />
                        <span className='mx-1 Scrollable__courseCardHeading'>
                          {elem.discount_price}
                        </span>
                        <span>
                          <del>{elem.course_price}</del>
                        </span>
                      </p>
                      {elem.bestseller_tag && (
                        <div className='Scrollable__bestSeller m-2 p-1'>Bestseller</div>
                      )} */}
                    </Card>
                  </div>
                );
              })}
              {/* {myCourses.length > 0 && (
                <div
                  className='col-sm-6 col-md-4 col-lg-2'
                  style={{ paddingLeft: 0, paddingRight: 0 }}
                >
                  <Card
                    className='Scrollable__courseCardContent text-center justify-content-center align-items-center'
                    onClick={() => goToCourse('myCourses')}
                    style={{ height: '246px' }}
                  >
                    <span className='Scrollable__viewAll'>View All</span>
                  </Card>
                </div>
              )} */}
            </section>
          </div>
        </>
      )}
    </>
  );
};

CoursesCards.propTypes = {
  allCourses: PropTypes.instanceOf(Array).isRequired,
  myCourses: PropTypes.instanceOf(Array).isRequired,
  goToCourse: PropTypes.func.isRequired,
  buyCourseId: PropTypes.func.isRequired,
  myCourseId: PropTypes.func.isRequired,
  clientLogo: PropTypes.string,
  featureName: PropTypes.string,
  country: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  globalCurrency: PropTypes.string,
  noViewAllButton: PropTypes.bool,
};

CoursesCards.defaultProps = {
  clientLogo: '',
  featureName: 'Courses',
  globalCurrency: '₹',
  noViewAllButton: false,
};

// col-sm-6 col-md-4 col-lg-2
