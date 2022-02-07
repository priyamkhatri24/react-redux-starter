import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { apiValidation, get } from '../../Utilities';
import { PageHeader } from '../Common';
import blankProfile from '../../assets/images/user.svg';
import './LiveClasses.scss';
import './Attendance.scss';

export const Analysis = (props) => {
  const { history } = props;
  const [attendence, setAttendence] = useState([]);

  useEffect(() => {
    const payload = {
      stream_id: history.location.state.stream_id,
      stream_type: history.location.state.stream_type,
    };
    get(payload, '/getAttendanceOfStream').then((res) => {
      const result = apiValidation(res);
      setAttendence(result);
      console.log(result, 'getAttendanceOfStream');
    });
  }, []);
  // console.log(streamId, streamType);
  return (
    <div>
      <PageHeader title='Analysis' />
      <div className='AttendanceLiveClasses__main'>
        {attendence.length > 0 ? (
          attendence.map((elem) => {
            return (
              <Card
                className='Attendance__Card mb-2'
                style={{
                  boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)',
                  borderRadius: '10px',
                }}
                key={elem.stream_id}
              >
                <Row className='p-2 align-items-center'>
                  <Col xs={2} className='text-center'>
                    <img
                      src={elem.profile_image == null ? blankProfile : elem.profile_image}
                      className='AttendanceLiveClasses__img'
                      borderRadius='50%'
                    />
                  </Col>
                  <Col xs={5}>
                    <p className='Attendance__batchName m-0'>{elem.first_name + elem.last_name}</p>
                  </Col>
                  <Col xs={5} className='text-center'>
                    {elem.value === 'A' ? (
                      <p className='m-0 Attendance__batchCount' style={{ color: 'red' }}>
                        Absent
                      </p>
                    ) : elem.value === 'P' ? (
                      <p style={{ color: 'green' }} className='m-0 Attendance__batchCount'>
                        Present{' '}
                        <span style={{ fontSize: '12px', color: 'green' }}>
                          {`(joined ${elem.join_count} times)`}
                        </span>
                      </p>
                    ) : elem.value === 'L' ? (
                      <p style={{ color: 'orange' }} className='m-0 Attendance__batchCount'>
                        Late
                      </p>
                    ) : null}
                  </Col>
                </Row>
              </Card>
            );
          })
        ) : (
          <div className='AttendanceLiveClasses__noItemText'>
            <Spinner animation='border' />
          </div>
        )}
      </div>
    </div>
  );
};

Analysis.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};

export default Analysis;
