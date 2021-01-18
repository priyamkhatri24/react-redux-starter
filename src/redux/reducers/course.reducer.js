import { courseConstants } from '../../constants';

const initialState = {
  courseId: null,
  courseObject: {},
  courseCurrentSlide: 1,
};

export function course(state = initialState, action) {
  switch (action.type) {
    case courseConstants.COURSEID:
      return {
        ...state,
        courseId: action.payload,
      };

    case courseConstants.COURSEOBJECT:
      return {
        ...state,
        courseObject: action.payload,
      };

    case courseConstants.COURSECURRENTSLIDE:
      return {
        ...state,
        courseCurrentSlide: action.payload,
      };

    default:
      return state;
  }
}

export const getCourseId = (state) => state.course.courseId;
export const getCourseObject = (state) => state.course.courseObject;
export const getCourseCurrentSlide = (state) => state.course.courseCurrentSlide;
