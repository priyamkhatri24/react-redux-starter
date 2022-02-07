import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  getAttendanceBatch,
  getAttendanceSelectedDate,
} from '../../redux/reducers/attendance.reducer';
import { apiValidation, get } from '../../Utilities';

import { PageHeader } from '../Common';
import TakeAttendance from './TakeAttendance';
import { colorConstants } from '../../constants';

const SelectedDateAttendance = (props) => {
  const { attendanceSelectedDate, attendanceBatch } = props;
  const [date, setDate] = useState(format(new Date(), 'yyyy-mm-dd'));
  const [students, setStudents] = useState([]);

  useEffect(() => {
    console.log(attendanceSelectedDate);
    const milliseconds = Date.parse(attendanceSelectedDate);
    const formattedDate = moment(milliseconds).format('YYYY-MM-DD');
    // 2022-02-27
    setDate(formattedDate);
    get(
      { client_batch_id: attendanceBatch.client_batch_id, date: formattedDate },
      '/getAttendanceOfBatchOfDate',
    ).then((res) => {
      console.log(res);
      const result = apiValidation(res).flat();

      setStudents(result);
    });
  }, [attendanceBatch, attendanceSelectedDate]);

  return (
    <>
      <PageHeader title={date} />
      <TakeAttendance students={students} isDateView />
    </>
  );
};

const mapStateToProps = (state) => ({
  attendanceSelectedDate: getAttendanceSelectedDate(state),
  attendanceBatch: getAttendanceBatch(state),
});

export default connect(mapStateToProps)(SelectedDateAttendance);

SelectedDateAttendance.propTypes = {
  attendanceSelectedDate: PropTypes.string.isRequired,
  attendanceBatch: PropTypes.instanceOf(Object).isRequired,
};
