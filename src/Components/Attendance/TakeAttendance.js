import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Col from 'react-bootstrap/Col';
import './Attendance.scss';
import userAvatar from '../../assets/images/user.svg';

const TakeAttendance = (props) => {
  const { students, submitStatus, date, updateStudents, isDateView, changeSlide } = props;

  const changeAttendance = (value, elem) => {
    const newStudents = students.map((e) => {
      if (elem.client_user_id === e.client_user_id) e.value = value;
      return e;
    });

    updateStudents(newStudents);
  };

  function getUrlExt(url) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
  }

  return (
    <Card
      style={{
        marginTop: '4rem',
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)',
        borderRadius: '10px',
      }}
      className='Attendance__Card'
    >
      <Row className='justify-content-end align-items-center mx-2 my-2'>
        {[
          { key: 1, color: 'rgba(38, 153, 251, 1)', name: 'Present' },
          { key: 2, color: 'rgba(255, 0, 0, 0.87)', name: 'Absent' },
          { key: 3, color: 'rgba(180, 255, 0, 0.87)', name: 'Late' },
        ].map((e) => {
          return (
            <div key={e.key} className='m-2 d-flex'>
              <span className='Attendance__dot' style={{ backgroundColor: e.color }} />
              <span className='Attendance__bulletNames m-1'>{e.name}</span>
            </div>
          );
        })}
      </Row>
      {!isDateView && (
        <Row
          className='justify-content-center px-2 mx-0 align-items-center'
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
        >
          <span
            className='ml-2'
            style={{ color: 'rgba(0, 0, 0, 0.54)', transform: 'scale(0.5)', flex: 1 }}
            onClick={() => changeSlide(0)}
            onKeyDown={() => changeSlide(0)}
            role='button'
            tabIndex='-1'
          >
            <ArrowBackIosIcon />
          </span>
          <span className='Attendance__headingSmall'>
            Today, {date} {submitStatus ? '(Submitted)' : ''}
          </span>
          <span style={{ flex: 1 }} />
        </Row>
      )}
      <div style={{ overflow: 'scroll', height: '65vh' }}>
        {students.map((elem) => {
          return (
            <Row
              className='p-2 m-0 align-items-center'
              style={{ borderBottom: '1px solid rgba(112, 112, 112, 0.1)' }}
              key={elem.client_user_id}
            >
              <Col xs={2} className='text-center'>
                <img
                  src={elem.profile_image ? elem.profile_image : userAvatar}
                  className='img-fluid'
                  alt='profile'
                  // width='40'
                  // height='40'
                  className='profileImageAttendance'
                  style={{ borderRadius: '50%' }}
                />
              </Col>
              <Col xs={5}>
                <p className='Attendance__batchName m-0'>
                  {elem.first_name} {elem.last_name}
                </p>
              </Col>
              <Col xs={5} className='text-right'>
                <p className='m-0 Attendance__batchCount'>{elem.count}</p>
                <p className='m-0 Attendance__batchStudents Attendance__3buttons'>
                  {[
                    { key: 1, value: 'P', color: 'rgba(38, 153, 251, 1)' },
                    { key: 2, value: 'A', color: 'rgba(255, 0, 0, 0.87)' },
                    { key: 3, value: 'L', color: 'rgba(180, 255, 0, 0.87)' },
                  ].map((e) => {
                    return (
                      <span
                        key={e.key}
                        className='Attendance__dot m-1'
                        style={
                          elem.value === e.value
                            ? {
                                backgroundColor: e.color,
                                height: '24px',
                                width: '24px',
                                border: `1px solid ${e.color}`,
                              }
                            : {
                                border: `1px solid ${e.color}`,
                                height: '24px',
                                width: '24px',
                                color: e.color,
                              }
                        }
                        onClick={() => changeAttendance(e.value, elem)}
                        onKeyDown={() => changeAttendance(e.value, elem)}
                        tabIndex='-1'
                        role='button'
                      >
                        {e.value}
                      </span>
                    );
                  })}
                </p>
              </Col>
            </Row>
          );
        })}
      </div>
    </Card>
  );
};

export default TakeAttendance;

TakeAttendance.propTypes = {
  students: PropTypes.instanceOf(Array).isRequired,
  submitStatus: PropTypes.number,
  date: PropTypes.string,
  updateStudents: PropTypes.func,
  isDateView: PropTypes.bool,
  changeSlide: PropTypes.func,
};

TakeAttendance.defaultProps = {
  date: '',
  submitStatus: 0,
  updateStudents: () => {},
  isDateView: false,
  changeSlide: () => {},
};
