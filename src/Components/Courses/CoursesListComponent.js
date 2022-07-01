import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { apiValidation, get } from '../../Utilities';
import rupee from '../../assets/images/Courses/rupee.svg';
import placeholder from '../../assets/images/ycIcon.png';
import './Courses.scss';

const ViewCoursesList = (props) => {
  const { clientId, clicked, currencySymbol } = props;
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    get({ client_id: clientId }, '/getPublishedCoursesOfCoaching1').then((res) => {
      const result = apiValidation(res);
      console.log(result, 'getPublishedCoursesOfCoaching1');
      setCourses(result);
    });
  }, [clientId]);

  //   const goToBuyCourse = (courseId) => {
  //     console.log(history);
  //     history.push(`/courses/buyCourse/${clientId}/${courseId}`);
  //   };
  const goToMyCourse = () => {
    console.log('gotomy');
  };

  return (
    <div>
      <div className='mx-auto' style={{ width: '90%' }}>
        {courses.slice(0, 6).map((course) => {
          const numberOfStars = Math.round(parseInt(course.course_rating, 10));
          const starArray = [...Array(numberOfStars)].map((e, i) => (
            /* eslint-disable */
            // <span role='img' aria-label='emoji' key={i}>
            <StarIcon
              style={{ fontSize: '8px', width: '10px' }}
              key={i}
              className='Courses__emoji'
            />
            // </span>
          ));

          const normalStars = 5 - numberOfStars;

          const whiteStarArray = [...Array(normalStars)].map((e, i) => (
            /* eslint-disable-next-line */
            <span role='img' aria-label='emoji' key={i}>
              <StarBorderIcon
                style={{ fontSize: '8px', width: '10px' }}
                className='Courses__emoji'
              />
            </span>
          ));
          return (
            <Row
              className='my-3 py-1 pl-0'
              key={course.course_id}
              onClick={
                true ? () => clicked(course.course_id) : () => goToMyCourse(course.course_id)
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
                <p className='Scrollable__courseCardHeading mb-0 mx-1'>{course.course_title}</p>
                {/* <p className='verySmallGrayText mx-1 mt-1 mb-0'>Aakash Gupta</p> */}
                <div style={{ marginTop: '-4px' }} className='mx-1'>
                  {starArray.map((e) => {
                    return e;
                  })}
                  {whiteStarArray.map((e) => {
                    return e;
                  })}
                  <span
                    className='Scrollable__smallText my-auto'
                    style={{ color: 'rgba(0, 0, 0, 0.87)', paddingLeft: '4px', fontSize: '10px' }}
                  >
                    {course.course_rating}
                  </span>
                  <span
                    className='Scrollable__smallText my-auto'
                    style={{ color: 'rgba(0, 0, 0, 0.87)', fontSize: '10px' }}
                  >
                    ({course.total_votes || '1000'})
                  </span>
                </div>
                <div className='Scrollable__courseCardSubHeading text-left mx-1'>
                  {/* <img src={rupee} alt='rupee' height='10' width='10' className='my-auto' /> */}
                  <span className='Scrollable__courseCardHeading my-auto'>
                    {`${currencySymbol} ${course.discount_price}`}
                  </span>
                  <span className='my-auto ml-1'>
                    <del>{`${currencySymbol} ${course.course_price}`}</del>
                  </span>

                  <div
                    style={{ fontSize: '9px' }}
                    className='Scrollable__bestSeller m-2 p-1 ml-auto my-auto'
                  >
                    Bestseller
                  </div>
                </div>
              </Col>
            </Row>
          );
        })}
      </div>
    </div>
  );
};

export default ViewCoursesList;

ViewCoursesList.propTypes = {
  clientId: PropTypes.number.isRequired,
  //   history: PropTypes.instanceOf(Object).isRequired,
  clicked: PropTypes.func.isRequired,
  currencySymbol: PropTypes.string.isRequired,
};
