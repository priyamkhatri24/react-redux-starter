import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { apiValidation, get } from '../../Utilities';
import { PageHeader } from '../Common';
import rupee from '../../assets/images/Courses/rupee.svg';
import ProgressBar from '../Common/ProgressBar/ProgressBar';
import placeholder from '../../assets/images/ycIcon.png';
import { courseActions } from '../../redux/actions/course.action';
import './Courses.scss';

const ViewCourses = (props) => {
  const { clientUserId, history, setCourseIdToStore, clientId, currentbranding } = props;
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (history.location.state) {
      if (history.location.state.type === 'allCourses') {
        get({ client_user_id: clientUserId }, '/getCoursesOfStudent').then((res) => {
          console.log(res);
          const result = apiValidation(res);
          setCourses(result);
        });
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
    <div>
      <PageHeader
        search
        shadow
        title={history.location.state.type === 'allCourses' ? ' All Courses' : 'My Courses'}
      />
      <div className='Courses__container'>
        {courses.map((course) => {
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
                        {`${currentbranding.branding.currency_symbol} ${course.discount_price}`}
                      </span>
                      <span className='my-auto'>
                        <del>{`${currentbranding.branding.currency_symbol} ${course.course_price}`}</del>
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
  );
};

const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
  clientId: getClientId(state),
  currentbranding: getCurrentBranding(state),
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
};
