import { courseConstants } from '../../constants';

function setCourseIdToStore(payload) {
  return { type: courseConstants.COURSEID, payload };
}

export const courseActions = {
  setCourseIdToStore,
};
