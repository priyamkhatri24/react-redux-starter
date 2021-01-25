import { courseConstants } from '../../constants';

const initialState = {
  courseId: null,
  courseObject: {},
  courseCurrentSlide: 1,
  courseCurrentSectionName: '',
  courseCurrentSectionId: null,
  courseSectionPriorityOrder: 0,
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

    case courseConstants.COURSESECTIONID:
      return {
        ...state,
        courseCurrentSectionId: action.payload,
      };

    case courseConstants.COURSESECTIONNAME:
      return {
        ...state,
        courseCurrentSectionName: action.payload,
      };

    case courseConstants.COURSESECTIONPRIORITYORDER:
      return {
        ...state,
        courseSectionPriorityOrder: action.payload,
      };

    default:
      return state;
  }
}

export const getCourseId = (state) => state.course.courseId;
export const getCourseObject = (state) => state.course.courseObject;
export const getCourseCurrentSlide = (state) => state.course.courseCurrentSlide;
export const getCourseCurrentSectionName = (state) => state.course.courseCurrentSectionName;
export const getCourseCurrentSectionId = (state) => state.course.courseCurrentSectionId;
export const getCourseSectionPriorityOrder = (state) => state.course.courseSectionPriorityOrder;
