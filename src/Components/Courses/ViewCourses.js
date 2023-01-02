import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
import {
  getCurrentDashboardData,
  getCurrentLocationData,
} from '../../redux/reducers/dashboard.reducer';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { apiValidation, get, formatDateInEnglish } from '../../Utilities';
import { PageHeader } from '../Common';
import rupee from '../../assets/images/Courses/rupee.svg';
import ProgressBar from '../Common/ProgressBar/ProgressBar';
import placeholder from '../../assets/images/Courses/thumbnail.png';
import { courseActions } from '../../redux/actions/course.action';
import './Courses.scss';

const ViewCourses = (props) => {
  const {
    clientUserId,
    history,
    setCourseIdToStore,
    clientId,
    currentbranding,
    dashboardData,
    locationData,
    dashboardData: {
      feature: {
        courses: { client_feature_name: featureName },
      },
    },
  } = props;
  const [courses, setCourses] = useState([]);
  const [currencyCodes, setCurrencyCodes] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [cached, setCached] = useState([]);
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
    get(null, '/getAllCurrencyCodes').then((data) => {
      const result = apiValidation(data);
      result.forEach((ele) => (ele.currencySymbol = ele.currency_symbol));
      setCurrencyCodes(result);
    });
  }, []);

  useEffect(() => {
    if (history.location.state) {
      if (history.location.state.type === 'allCourses') {
        get({ client_user_id: clientUserId, client_id: clientId }, '/getCoursesOfStudent2').then(
          (res) => {
            console.log(res);
            const result = apiValidation(res);
            setCourses(result);
            setCached(result);
          },
        );
      } else {
        get({ client_user_id: clientUserId }, '/getSubscribedCoursesOfStudent').then((res) => {
          console.log(res, 'subsss');
          const result = apiValidation(res);
          setCourses(result);
          setCached(result);
        });
      }
    } else {
      history.push('/');
    }
  }, [clientUserId, history]);

  useEffect(() => {
    let timer;
    if (searchString) {
      timer = setTimeout(() => {
        const filtered = cached.filter((ele) =>
          ele.course_title.toLowerCase().includes(searchString),
        );
        setCourses(filtered);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [searchString]);

  const goToBuyCourse = (id) => {
    const { push } = history;
    push(`/courses/buyCourse/${window.btoa(clientId)}/${window.btoa(id)}`);
  };

  const goToMyCourse = (id) => {
    history.push('/courses/myCourse');
    setCourseIdToStore(id);
  };

  const triggerSearch = (search) => {
    setSearchString(search.toLowerCase());
  };

  return (
    <>
      <PageHeader
        search
        searchFilter={triggerSearch}
        title={
          history.location.state.type === 'allCourses'
            ? `All ${featureName || 'Courses'}`
            : `My ${featureName || 'Courses'}`
        }
      />
      <div>
        <div className='Courses__container'>
          {courses.map((course) => {
            let totalRating = 0;
            let calculatedRating = 0;
            if (history.location.state.type === 'allCourses' && course.reviews.length) {
              const reviewsArary = course.reviews;
              for (let i = 0; i < reviewsArary.length; i++) {
                totalRating += Number(reviewsArary[i].rating);
              }

              calculatedRating = totalRating / reviewsArary.length;
            }

            if (course.is_regional) {
              const countryFilteredPrices = course.prices_array.filter(
                (ele) => ele.country_name === locationData.country,
              );
              const checkForAllStates = countryFilteredPrices.find((ele) => ele.state_name === '');
              const checkForCurrentState = countryFilteredPrices.find(
                (ele) => ele.state_name === locationData.state,
              );

              if (checkForAllStates) {
                course.course_price = checkForAllStates.region_course_price;
                course.discount_price = checkForAllStates.region_discount_price;
                course.currencySymbol = currencyCodes.find(
                  (ele) => ele.currency_code === checkForAllStates.currency_code,
                )?.currencySymbol;
              }
              if (checkForCurrentState) {
                course.course_price = checkForCurrentState.region_course_price;
                course.discount_price = checkForCurrentState.region_discount_price;
                course.currencySymbol = currencyCodes.find(
                  (ele) => ele.currency_code === checkForCurrentState.currency_code,
                )?.currencySymbol;
              }
            }
            const numberOfStars = Math.round(parseInt(Math.floor(calculatedRating), 10));
            const starArray = [...Array(numberOfStars)].map((e, i) => (
              /* eslint-disable-next-line */
              <span role='img' aria-label='emoji' key={i}>
                <StarIcon className='Courses__emoji' />
              </span>
            ));

            const normalStars = 5 - numberOfStars;

            const whiteStarArray = [...Array(normalStars)].map((e, i) => (
              /* eslint-disable-next-line */
              <span role='img' aria-label='emoji' key={i}>
                <StarBorderIcon className='Courses__emoji' />
              </span>
            ));
            return (
              <Row
                className='m-3 py-1'
                key={course.course_id}
                onClick={
                  history.location.state.type === 'allCourses'
                    ? () => goToBuyCourse(course.course_id)
                    : () => goToMyCourse(course.course_id)
                }
              >
                <Col xs={4} sm={2} className='Courses__image'>
                  <img
                    src={course.course_display_image ? course.course_display_image : placeholder}
                    alt='course '
                    style={
                      !course.course_display_image
                        ? { backgroundColor: colors[Math.floor(Math.random() * colors.length)] }
                        : { objectFit: 'cover' }
                    }
                    className='mx-auto Courses__viewCourseImage'
                  />
                </Col>
                <Col xs={8} sm={8} className='p-0 pl-2'>
                  <p className='Scrollable__courseCardHeading mb-0 mx-2'>{course.course_title}</p>
                  {history.location.state.type === 'allCourses' ? (
                    <>
                      {course.reviews.length && course.allow_reviews ? (
                        <div className='mx-2 d-flex align-items-center'>
                          {starArray.map((e) => {
                            return e;
                          })}
                          {whiteStarArray.map((e) => {
                            return e;
                          })}
                          <span
                            className='Scrollable__smallText Scrollable__negativeMargin2 my-auto'
                            style={{
                              color: 'rgba(0, 0, 0, 0.87)',
                              paddingLeft: '5px',
                              fontSize: '10px',
                            }}
                          >
                            {String(calculatedRating).slice(0, 3)}
                          </span>
                          <span
                            className='Scrollable__smallText Scrollable__negativeMargin2 my-auto ml-1'
                            style={{
                              color: 'rgba(0, 0, 0, 0.87)',
                              fontSize: '10px',
                            }}
                          >
                            ({course.reviews.length})
                          </span>
                        </div>
                      ) : (
                        <p
                          style={{ color: 'black', fontSize: '9px' }}
                          className='Scrollable__smallText my-1 mx-2'
                        >
                          Subscribe and be the first one to review this course
                        </p>
                      )}
                      <Row className='Scrollable__courseCardSubHeading text-left mx-2'>
                        {/* <img src={rupee} alt='rupee' height='10' width='10' className='my-auto' /> */}
                        <span className='mx-0 Scrollable__courseCardHeading my-auto'>
                          {course.currencySymbol
                            ? `${course.currencySymbol} ${course.discount_price}`
                            : `${currentbranding.branding.currency_symbol} ${course.discount_price}`}
                        </span>
                        <span className='my-auto ml-2'>
                          <del>
                            {course.currencySymbol
                              ? `${course.currencySymbol} ${course.course_price}`
                              : `${currentbranding.branding.currency_symbol} ${course.course_price}`}
                          </del>
                        </span>
                        {course.bestseller_tag && (
                          <div
                            style={{ fontSize: '9px' }}
                            className='Scrollable__bestSeller m-2 p-1 ml-auto my-auto'
                          >
                            Bestseller
                          </div>
                        )}
                      </Row>
                      {course.modified_at ? (
                        <Row className='mx-2' style={{ fontSize: '10px', width: '100%' }}>
                          <span className='mx-0' style={{ fontFamily: 'Montserrat-Regular' }}>
                            Last updated on {formatDateInEnglish(course.modified_at)}
                          </span>
                        </Row>
                      ) : null}
                    </>
                  ) : (
                    <div
                      style={{ width: '93%', margin: 'auto 0.5rem' }}
                      className='d-flex align-items-center'
                    >
                      <ProgressBar
                        width={`${course.completed_percentage}%`}
                        height='2px'
                        borderRadius='100px'
                        customStyle={{
                          backgroundColor: '#4154cf',
                          borderRadius: '100px',
                        }}
                        myProgressCustomStyle={{
                          width: '89%',
                          margin: '14px 20px 0px 0px',
                          backgroundColor: 'rgba(0,0,0,0.42)',
                        }}
                      />
                      <p style={{ marginTop: '14px' }} className='verySmallText mb-0'>
                        {course.completed_percentage.toFixed(0)}%
                      </p>
                    </div>
                  )}
                </Col>
              </Row>
            );
          })}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
  clientId: getClientId(state),
  dashboardData: getCurrentDashboardData(state),
  currentbranding: getCurrentBranding(state),
  locationData: getCurrentLocationData(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setCourseIdToStore: (payload) => {
      dispatch(courseActions.setCourseIdToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewCourses);

ViewCourses.propTypes = {
  clientUserId: PropTypes.number.isRequired,
  clientId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  setCourseIdToStore: PropTypes.func.isRequired,
  currentbranding: PropTypes.instanceOf(Object).isRequired,
  dashboardData: PropTypes.instanceOf(Object).isRequired,
  locationData: PropTypes.instanceOf(Object).isRequired,
  // featureName: PropTypes.string,
};

ViewCourses.defaultProps = {
  // featureName: 'Courses',
};
