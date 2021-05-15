import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { getAttendanceBatch } from '../../redux/reducers/attendance.reducer';
import { PageHeader } from '../Common';

const AttendanceBatch = (props) => {
  const { attendanceBatch } = props;

  const changeDate = () => {
    console.log('jai');
  };

  return (
    <>
      <PageHeader
        title={attendanceBatch.batch_name}
        customIcon={<DateRangeIcon />}
        handleCustomIcon={changeDate}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  attendanceBatch: getAttendanceBatch(state),
});

export default connect(mapStateToProps)(AttendanceBatch);

AttendanceBatch.propTypes = {
  attendanceBatch: PropTypes.instanceOf(Object).isRequired,
};
