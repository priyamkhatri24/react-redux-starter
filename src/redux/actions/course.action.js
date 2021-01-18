import { courseConstants } from '../../constants';

function setCourseIdToStore(payload) {
  return { type: courseConstants.COURSEID, payload };
}

function setCourseObjectToStore(payload) {
  return { type: courseConstants.COURSEOBJECT, payload };
}

function setCourseCurrentSlideToStore(payload) {
  return { type: courseConstants.COURSECURRENTSLIDE, payload };
}

export const courseActions = {
  setCourseIdToStore,
  setCourseObjectToStore,
  setCourseCurrentSlideToStore,
};
