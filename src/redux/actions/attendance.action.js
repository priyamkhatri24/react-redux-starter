import { attendanceConstants } from '../../constants';

function setAttendanceBatchToStore(payload) {
  return { type: attendanceConstants.ATTENDANCEBATCH, payload };
}

function setAttendanceSelectedDateToStore(payload) {
  return { type: attendanceConstants.ATTENDANCESELECTEDDATE, payload };
}

export const attendanceActions = {
  setAttendanceBatchToStore,
  setAttendanceSelectedDateToStore,
};
