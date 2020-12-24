import { homeworkConstants } from '../../constants';

function setTestIdToStore(payload) {
  return { type: homeworkConstants.TESTID, payload };
}

function setTestNameToStore(payload) {
  return { type: homeworkConstants.TESTNAME, payload };
}

function setCurrentSlide(payload) {
  return { type: homeworkConstants.CURRENTSLIDE, payload };
}

function setQuestionArrayToStore(payload) {
  return { type: homeworkConstants.QUESTIONARRAY, payload };
}

function setSelectedQuestionArrayToStore(payload) {
  return { type: homeworkConstants.SELECTEDQUESTIONARRAY, payload };
}

function setCurrentChapterArrayToStore(payload) {
  return { type: homeworkConstants.CURRENTCHAPTERARRAY, payload };
}

function setCurrentSubjectArrayToStore(payload) {
  return { type: homeworkConstants.CURRENTSUBJECTARRAY, payload };
}

function clearTests() {
  return { type: homeworkConstants.CLEARTESTS };
}

export const homeworkActions = {
  setTestIdToStore,
  setTestNameToStore,
  setCurrentSlide,
  setQuestionArrayToStore,
  setSelectedQuestionArrayToStore,
  setCurrentChapterArrayToStore,
  setCurrentSubjectArrayToStore,
  clearTests,
};
