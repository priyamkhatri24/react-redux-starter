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

function setCourseCurrentSectionNameToStore(payload) {
  return { type: courseConstants.COURSESECTIONNAME, payload };
}

function setCourseCurrentSectionIdToStore(payload) {
  return { type: courseConstants.COURSESECTIONID, payload };
}

function setCourseSectionPriorityOrderToStore(payload) {
  return { type: courseConstants.COURSESECTIONPRIORITYORDER, payload };
}

export const courseActions = {
  setCourseIdToStore,
  setCourseObjectToStore,
  setCourseCurrentSlideToStore,
  setCourseCurrentSectionIdToStore,
  setCourseCurrentSectionNameToStore,
  setCourseSectionPriorityOrderToStore,
};
