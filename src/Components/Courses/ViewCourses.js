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
import { apiValidation, get } from '../../Utilities';
import { PageHeader } from '../Common';
import rupee from '../../assets/images/Courses/rupee.svg';
import ProgressBar from '../Common/ProgressBar/ProgressBar';
import placeholder from '../../assets/images/ycIcon.png';
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

  useEffect(() => {
    get(null, '/getAllCurrencyCodes').then((data) => {
      const result = apiValidation(data);
      result.forEach((ele) => (ele.currencySymbol = ele.currency_symbol));
      setCurrencyCodes(result);
    });
  });

  useEffect(() => {
    if (history.location.state) {
      if (history.location.state.type === 'allCourses') {
        get({ client_user_id: clientUserId, client_id: clientId }, '/getCoursesOfStudent2').then(
          (res) => {
            console.log(res);
            const result = apiValidation(res);
            setCourses(result);
          },
        );
      } else {
        get({ client_user_id: clientUserId }, '/getSubscribedCoursesOfStudent').then((res) => {
          console.log(res, 'subsss');
          const result = apiValidation(res);
          setCourses(result);
        });
      }
    } else {
      history.push('/');
    }
  }, [clientUserId, history]);

  const goToBuyCourse = (id) => {
    const { push } = history;
    push(`/courses/buyCourse/${window.btoa(clientId)}/${window.btoa(id)}`);
  };

  const goToMyCourse = (id) => {
    history.push('/courses/myCourse');
    setCourseIdToStore(id);
  };

  return (
    <>
      <PageHeader
        search
        shadow
        title={
          history.location.state.type === 'allCourses'
            ? `All ${featureName || 'Courses'}`
            : `My ${featureName || 'Courses'}`
        }
      />
      <div>
        <div className='Courses__container'>
          {courses.map((course) => {
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
            const numberOfStars = Math.round(parseInt(course.course_rating, 10));
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
                    className='mx-auto Courses__viewCourseImage'
                  />
                </Col>
                <Col xs={8} sm={8} className='p-0'>
                  <p className='Scrollable__courseCardHeading mb-0 mx-2'>{course.course_title}</p>
                  {history.location.state.type === 'allCourses' ? (
                    <>
                      <div className='mx-2 d-flex align-items-center'>
                        {starArray.map((e) => {
                          return e;
                        })}
                        {whiteStarArray.map((e) => {
                          return e;
                        })}
                        <span
                          className='Scrollable__smallText my-auto'
                          style={{
                            color: 'rgba(0, 0, 0, 0.87)',
                            paddingLeft: '5px',
                            fontSize: '10px',
                          }}
                        >
                          {course.course_rating}
                        </span>
                        <span
                          className='Scrollable__smallText my-auto'
                          style={{ color: 'rgba(0, 0, 0, 0.87)', fontSize: '10px' }}
                        >
                          ({course.total_votes})
                        </span>
                      </div>
                      <Row className='Scrollable__courseCardSubHeading text-left mx-2'>
                        {/* <img src={rupee} alt='rupee' height='10' width='10' className='my-auto' /> */}
                        <span className='mx-1 Scrollable__courseCardHeading my-auto'>
                          {course.currencySymbol
                            ? `${course.currencySymbol} ${course.discount_price}`
                            : `${currentbranding.branding.currency_symbol} ${course.discount_price}`}
                        </span>
                        <span className='my-auto'>
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
