import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { apiValidation, get } from '../../Utilities';
import { PageHeader } from '../Common';
import rupee from '../../assets/images/Courses/rupee.svg';
import placeholder from '../../assets/images/avatarImage.jpg';
import { courseActions } from '../../redux/actions/course.action';

const ViewCourses = (props) => {
  const { clientUserId, history, setCourseIdToStore } = props;
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
          console.log(res);
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
    push({ pathname: '/courses/buyCourse', state: { id, clientUserId } });
  };

  const goToMyCourse = (id) => {
    history.push('/courses/myCourse');
    setCourseIdToStore(id);
  };

  return (
    <div>
      <PageHeader
        title={history.location.state.type === 'allCourses' ? ' All Courses' : 'My Courses'}
      />
      <div style={{ marginTop: '5rem' }}>
        {courses.map((course) => {
          const numberOfStars = Math.round(parseInt(course.course_rating, 10));
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
            <Row
              className='m-3'
              key={course.course_id}
              onClick={
                history.location.state.type === 'allCourses'
                  ? () => goToBuyCourse(course.course_id)
                  : () => goToMyCourse(course.course_id)
              }
            >
              <Col xs={4} className=''>
                <img
                  src={course.course_display_image ? course.course_display_image : placeholder}
                  alt='course '
                  className='mx-auto Courses__viewCourseImage'
                />
              </Col>
              <Col xs={8} className='p-0'>
                <p className='Scrollable__courseCardHeading mb-0 mx-2'>{course.course_title}</p>
                <Row className='mx-2'>
                  {starArray.map((e) => {
                    return e;
                  })}
                  {whiteStarArray.map((e) => {
                    return e;
                  })}
                  <span
                    className='Scrollable__smallText my-auto'
                    style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                  >
                    {course.course_rating}
                  </span>
                  <span
                    className='Scrollable__smallText my-auto'
                    style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                  >
                    ({course.total_votes})
                  </span>
                </Row>
                <Row className='Scrollable__courseCardSubHeading text-left mx-2'>
                  <img src={rupee} alt='rupee' height='10' width='10' className='my-auto' />
                  <span className='mx-1 Scrollable__courseCardHeading my-auto'>
                    {course.discount_price}
                  </span>
                  <span className='my-auto'>
                    <del>{course.course_price}</del>
                  </span>
                  {course.bestseller_tag && (
                    <div className='Scrollable__bestSeller m-2 p-1 ml-auto my-auto'>Bestseller</div>
                  )}
                </Row>
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
  history: PropTypes.instanceOf(Object).isRequired,
  setCourseIdToStore: PropTypes.func.isRequired,
};
