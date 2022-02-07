import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { get, apiValidation } from '../../Utilities';
import { PageHeader } from '../Common';
import placeholder from '../../assets/images/user.svg';
import './Courses.scss';
import { history } from '../../Routing/History';

const CourseStatistics = (props) => {
  const {
    history: {
      location: {
        state: { id, currencySymbol },
      },
    },
  } = props;
  const [stats, setStats] = useState([]);
  useEffect(() => {
    get({ course_id: id }, '/getStatisticsOfCourse').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setStats(result);
      console.log(result, 'getStatisticsOfCourse');
    });
  }, [id]);

  const goToCourseStatistics = () => {
    console.log('test');
    history.push({ pathname: '/courses/teachercourse', state: { activeTab: 'Statistics' } });
  };

  return (
    <>
      <PageHeader title='Details' customBack handleBack={goToCourseStatistics} />
      <div className='Courses__statisticsConatiner'>
        {stats.map((course) => {
          const subscribedDate = new Date(Number(course.subscribed_at) * 1000);
          return (
            <Row key={course.course_id} style={{ marginBottom: '2rem' }}>
              <Col xs={4} className='Courses__statisticsImg'>
                <img
                  src={course.profile_image ? course.profile_image : placeholder}
                  alt='course '
                  className='mx-auto Courses__userProfileStats'
                />
              </Col>
              <Col xs={8} className='p-0'>
                <p className='Scrollable__courseCardHeading mx-0 mb-0'>
                  {course.first_name} {course.last_name}
                </p>
                <div className='mx-0'>
                  <div>
                    <span
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        color: '#000',
                        fontSize: '12px',
                      }}
                      className='mx-0 mb-0 my-auto'
                    >
                      {`${currencySymbol} ${course.paid}`}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: 'Montserrat-Regular',
                        color: '#000',
                        fontSize: '12px',
                      }}
                      className='m-0 my-auto'
                    >
                      {subscribedDate.toString().split(' ').slice(1, 5).join(' ')}
                    </span>
                  </div>
                </div>
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
        currencySymbol: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};
