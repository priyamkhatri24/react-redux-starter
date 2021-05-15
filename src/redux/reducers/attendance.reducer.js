import { attendanceConstants } from '../../constants';

const initialState = {
  attendanceBatch: {},
  attendanceSelectedDate: '',
};

export function attendance(state = initialState, action) {
  switch (action.type) {
    case attendanceConstants.ATTENDANCEBATCH:
      return {
        ...state,
        attendanceBatch: action.payload,
      };

    case attendanceConstants.ATTENDANCESELECTEDDATE:
      return {
        ...state,
        attendanceSelectedDate: action.payload,
      };

    default:
      return state;
  }
}

export const getAttendanceBatch = (state) => state.attendance.attendanceBatch;
export const getAttendanceSelectedDate = (state) => state.attendance.attendanceSelectedDate;
