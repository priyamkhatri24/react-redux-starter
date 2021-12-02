import { courseConstants } from '../../constants';

const initialState = {
  courseId: null,
  courseObject: {},
  courseCurrentSlide: 1,
  courseCurrentSectionName: '',
  courseCurrentSectionId: null,
  courseSectionPriorityOrder: 0,
  courseAddContentTestId: 0,
  courseNowPlayingVideo: null,
  courseDocumentToOpen: null,
};

export function course(state = initialState, action) {
  switch (action.type) {
    case courseConstants.COURSEID:
      return state.courseId === action.payload
        ? {
            ...state,
            courseId: action.payload,
          }
        : {
            ...state,
            courseId: action.payload,
            courseNowPlayingVideo: null,
            courseDocumentToOpen: null,
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

    case courseConstants.COURSEADDCONTENTTESTID:
      return {
        ...state,
        courseAddContentTestId: action.payload,
      };

    case courseConstants.COURSENOWPLAYINGVIDEO:
      return {
        ...state,
        courseNowPlayingVideo: action.payload,
      };

    case courseConstants.COURSEDOCUMENTTOOPEN:
      return {
        ...state,
        courseDocumentToOpen: action.payload,
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
export const getCourseAddContentTestId = (state) => state.course.courseAddContentTestId;
export const getCourseNowPlayingVideo = (state) => state.course.courseNowPlayingVideo;
export const getCourseDocumentToOpen = (state) => state.course.courseDocumentToOpen;
