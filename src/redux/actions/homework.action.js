import { homeworkConstants } from '../../constants';

function setTestIdToStore(payload) {
  return { type: homeworkConstants.TESTID, payload };
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

function clearTests() {
  return { type: homeworkConstants.CLEAR };
}

export const homeworkActions = {
  setTestIdToStore,
  setCurrentSlide,
  setQuestionArrayToStore,
  setSelectedQuestionArrayToStore,
  clearTests,
};
