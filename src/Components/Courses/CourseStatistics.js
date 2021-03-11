import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { get, apiValidation } from '../../Utilities';
import { PageHeader } from '../Common';
import placeholder from '../../assets/images/ycIcon.png';

const CourseStatistics = (props) => {
  const {
    history: {
      location: {
        state: { id },
      },
    },
  } = props;

  const [stats, setStats] = useState([]);

  useEffect(() => {
    get({ course_id: id }, '/getStatisticsOfCourse').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setStats(result);
    });
  }, [id]);

  return (
    <>
      <PageHeader title='Details' />
      <div style={{ marginTop: '5rem' }}>
        {stats.map((course) => {
          return (
            <Row className='m-3' key={course.course_id}>
              <Col xs={4} className=''>
                <img
                  src={course.profile_image ? course.profile_image : placeholder}
                  alt='course '
                  className='mx-auto Courses__viewCourseImage'
                />
              </Col>
              <Col xs={8} className='p-0'>
                <p className='Scrollable__courseCardHeading mx-2 mb-1'>
                  {course.first_name} {course.last_name}
                </p>
                <Row className='mx-2'>
                  <div style={{ background: '#00ff00', borderRadius: '5px' }}>
                    <span
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color: '#fff',
                        fontSize: '10px',
                      }}
                      className='m-2 my-auto'
                    >
                      {course.paid}
                    </span>
                  </div>
                </Row>
              </Col>
            </Row>
          );
        })}
      </div>
    </>
  );
};

export default CourseStatistics;

CourseStatistics.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }),
    }),
  }).isRequired,
};
