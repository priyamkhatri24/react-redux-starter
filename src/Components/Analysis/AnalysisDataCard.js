import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';

import './Analysis.scss';
import '../Live Classes/LiveClasses.scss';

const AnalysisDataCard = (props) => {
  const { elem, IsStudent, buttonClick } = props;
  return !IsStudent ? (
    <Card className='p-1 Analysis__card' onClick={() => buttonClick(elem)}>
      <p className='LiveClasses__adminHeading mb-0 mt-2 mx-2'>{elem.test_name}</p>
      <p className='LiveClasses__adminCardTime mb-0 mx-2' style={{ fontSize: '10px' }}>
        Due:{' '}
        {elem.due_date !== 'NaN' &&
          format(fromUnixTime(parseInt(elem.due_date, 10)), 'dd-MMM-yyyy')}
      </p>
      <Row className='m-0'>
        <Col xs={3} className='text-center'>
          <p className='Analysis__bigNumbers mb-0'>
            {elem.average.toFixed(2)}/{elem.total_questions}
          </p>
          <p className='Analysis__cardLabel'>Average</p>
        </Col>
        <Col xs={3} className='text-center'>
          <p className='Analysis__bigNumbers mb-0'>
            {elem.maximum_marks}/{elem.total_questions}
          </p>
          <p className='Analysis__cardLabel'>Highest</p>
        </Col>
        <Col xs={3} className='text-center'>
          <p className='Analysis__bigNumbers mb-0'>
            {elem.minimum_marks}/{elem.total_questions}
          </p>
          <p className='Analysis__cardLabel'>Lowest</p>
        </Col>
        <Col xs={3} className='text-center'>
          <p className='Analysis__bigNumbers mb-0'>
            {elem.total_submission}/{elem.total_student}
          </p>
          <p className='Analysis__cardLabel'>Completed</p>
        </Col>
      </Row>
    </Card>
  ) : (
    <Card className='p-1 Analysis__card' onClick={() => buttonClick(elem)}>
      <p className='LiveClasses__adminHeading mb-0 mt-2 mx-2 pb-2'>
        {elem.first_name} {elem.last_name}
      </p>
      <Row className='m-0'>
        <Col xs={3} className='text-center'>
          <p className='Analysis__bigNumbers mb-0' style={{ fontSize: '16px' }}>
            {elem.performance === 'Student has not attempted any questions yet'
              ? 'NA'
              : `${elem.performance}%`}
          </p>
          <p className='Analysis__cardLabel' style={{ fontSize: '8px' }}>
            Performance
          </p>
        </Col>
        <Col xs={3} className='text-center'>
          <p className='Analysis__bigNumbers mb-0' style={{ fontSize: '16px' }}>
            {elem.completed_test}/{elem.test_count}
          </p>
          <p className='Analysis__cardLabel' style={{ fontSize: '8px' }}>
            Test
          </p>
        </Col>
        <Col xs={3} className='text-center'>
          <p className='Analysis__bigNumbers mb-0' style={{ fontSize: '16px' }}>
            {elem.completed_homework}/{elem.homework_count}
          </p>
          <p className='Analysis__cardLabel' style={{ fontSize: '8px' }}>
            Homework
          </p>
        </Col>
        <Col xs={3} className='text-center'>
          <p className='Analysis__bigNumbers mb-0' style={{ fontSize: '16px' }}>
            {elem.attendance_percentage === 'There are no attendance records yet'
              ? 'NA'
              : `${elem.attendance_percentage}%`}
          </p>
          <p className='Analysis__cardLabel' style={{ fontSize: '8px' }}>
            Attendance
          </p>
        </Col>
      </Row>
    </Card>
  );
};

export default AnalysisDataCard;

AnalysisDataCard.propTypes = {
  elem: PropTypes.instanceOf(Object).isRequired,
  IsStudent: PropTypes.bool,
  buttonClick: PropTypes.func.isRequired,
};

AnalysisDataCard.defaultProps = {
  IsStudent: false,
};
