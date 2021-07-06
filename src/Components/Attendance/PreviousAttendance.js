import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import Col from 'react-bootstrap/Col';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import './Attendance.scss';
import userAvatar from '../../assets/images/user.svg';
import { getAttendanceBatch } from '../../redux/reducers/attendance.reducer';
import { apiValidation, get } from '../../Utilities';

const PreviousAttendance = (props) => {
  const { attendanceBatch, changeSlide } = props;
  const [prevAttendance, setPrevAttendance] = useState([]);

  useEffect(() => {
    get({ client_batch_id: attendanceBatch.client_batch_id }, '/getAttendanceOfBatch').then(
      (res) => {
        console.log(res);

        const result = apiValidation(res)
          .filter((e) => e.length > 0)
          .map((arr) => {
            const obj = {
              name: `${arr[0].first_name} ${arr[0].last_name}`,
              attendance_id: arr[0].attendance_id,
              profile_image: arr[0].profile_image,
            };

            const timeOfAttendance = arr.map((el) => {
              const ob = {};
              ob.time_of_attendance = format(parseISO(el.time_of_attendance), 'dd');
              ob.value = el.value;
              return ob;
            });
            let size = timeOfAttendance.length;
            while (size < 5) {
              timeOfAttendance.push({ time_of_attendance: `0${size + 1}`, value: 'N' });
              size += 1;
            }

            obj.timeOfAttendance = timeOfAttendance;
            return obj;
          });

        console.log(result);
        setPrevAttendance(result);
      },
    );
  }, [attendanceBatch]);
  return (
    <Card
      style={{
        marginTop: '4rem',
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)',
        borderRadius: '10px',
      }}
      className='mx-2'
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
      <Row
        className='flex-row-reverse p-2 m-0 align-items-center'
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
      >
        <Col xs={5} className='text-right'>
          <span
            className=''
            style={{ color: 'rgba(0, 0, 0, 0.54)' }}
            onClick={() => changeSlide(1)}
            onKeyDown={() => changeSlide(1)}
            role='button'
            tabIndex='-1'
          >
            <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
          </span>
        </Col>
        {prevAttendance.length > 0 &&
          prevAttendance[0].timeOfAttendance.map((elem) => {
            return (
              <Col className='Attendance__headingSmall text-center p-0'>
                {elem.time_of_attendance}
              </Col>
            );
          })}
      </Row>
      <div style={{ overflow: 'scroll', height: '65vh' }}>
        {prevAttendance.length > 0 ? (
          prevAttendance.map((elem) => {
            return (
              <Row
                className='p-2 m-0 align-items-center justify-content-center flex-row-reverse'
                style={{ borderBottom: '1px solid rgba(112, 112, 112, 0.1)' }}
                key={elem.attendance_id}
              >
                <Col xs={5} className='d-flex align-items-center ml-2 '>
                  <img
                    src={elem.profile_image ? elem.profile_image : userAvatar}
                    alt='profile'
                    width='40'
                    height='40'
                    style={{ borderRadius: '50%' }}
                  />
                  <span
                    className='ml-1'
                    style={{
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textTransform: 'capitalize',
                    }}
                  >
                    {elem.name}
                  </span>
                </Col>

                {elem.timeOfAttendance.map((el) => {
                  return (
                    <Col className='text-center'>
                      <span
                        className='Attendance__dot'
                        style={
                          el.value === 'A'
                            ? {
                                backgroundColor: 'rgba(255, 0, 0, 0.87)',
                                height: '23px',
                                width: '23px',
                                border: `1px solid rgba(255, 0, 0, 0.87)`,
                              }
                            : el.value === 'P'
                            ? {
                                backgroundColor: 'rgba(38, 153, 251, 1)',
                                height: '23px',
                                width: '23px',
                                border: `1px solid rgba(38, 153, 251, 1)`,
                              }
                            : el.value === 'L'
                            ? {
                                backgroundColor: 'rgba(180, 255, 0, 0.87)',
                                height: '23px',
                                width: '23px',
                                border: `1px solid rgba(180, 255, 0, 0.87)`,
                              }
                            : {
                                border: `3px solid rgba(112, 112, 112, 1)`,
                                height: '21px',
                                width: '21px',
                                color: 'rgba(112, 112, 112, 1)',
                              }
                        }
                      />
                    </Col>
                  );
                })}
              </Row>
            );
          })
        ) : (
          <p className='m-4' style={{ fontFamily: 'Montserrat-Regular', fontSize: '13px' }}>
            There is currently no previous Attendance Data.
          </p>
        )}
      </div>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  attendanceBatch: getAttendanceBatch(state),
});

export default connect(mapStateToProps)(PreviousAttendance);

PreviousAttendance.propTypes = {
  attendanceBatch: PropTypes.instanceOf(Object).isRequired,
  changeSlide: PropTypes.func.isRequired,
};
