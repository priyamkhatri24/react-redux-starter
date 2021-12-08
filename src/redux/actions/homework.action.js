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

function setTestClassSubjectToStore(payload) {
  return { type: homeworkConstants.TESTCLASSSUBJECT, payload };
}

function setTestIsDraftToStore(payload) {
  return { type: homeworkConstants.TESTISDRAFT, payload };
}

function setHomeworkLanguageTypeToStore(payload) {
  return { type: homeworkConstants.HOMEWORKLANGUAGETYPE, payload };
}

function setSelectedCourseToStore(payload) {
  return { type: homeworkConstants.SELECTEDCOURSE, payload };
}

function setSelectedSubjectToStore(payload) {
  return { type: homeworkConstants.SELECTEDSUBJECT, payload };
}

function setSelectedChapterToStore(payload) {
  return { type: homeworkConstants.SELECTEDCHAPTER, payload };
}

function setSelectedTypeToStore(payload) {
  return { type: homeworkConstants.SELECTEDTYPE, payload };
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
  setTestClassSubjectToStore,
  setTestIsDraftToStore,
  setHomeworkLanguageTypeToStore,
  setSelectedChapterToStore,
  setSelectedCourseToStore,
  setSelectedSubjectToStore,
  setSelectedTypeToStore,
};
