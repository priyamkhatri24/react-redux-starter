import { courseConstants } from '../../constants';

const initialState = {
  courseId: null,
};

export function course(state = initialState, action) {
  switch (action.type) {
    case courseConstants.COURSEID:
      return {
        ...state,
        courseId: action.payload,
      };

    default:
      return state;
  }
}

export const getCourseId = (state) => state.course.courseId;
