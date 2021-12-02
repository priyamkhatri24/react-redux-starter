import { homeworkConstants } from '../../constants';

const initialState = {
  testId: null,
  testName: '',
  currentSlide: 0,
  questionArray: [],
  selectedQuestionArray: [],
  currentChapterArray: [],
  currentSubjectArray: [],
  testIsDraft: 0,
  testClassSubject: {},
  homeworkLanguageType: '',
};

export function homework(state = initialState, action) {
  switch (action.type) {
    case homeworkConstants.TESTID:
      return {
        ...state,
        testId: action.payload,
      };

    case homeworkConstants.TESTNAME:
      return {
        ...state,
        testName: action.payload.toString(),
      };

    case homeworkConstants.CURRENTSLIDE:
      return {
        ...state,
        currentSlide: action.payload,
      };

    case homeworkConstants.QUESTIONARRAY:
      return {
        ...state,
        questionArray: action.payload,
      };
    case homeworkConstants.SELECTEDQUESTIONARRAY:
      return {
        ...state,
        selectedQuestionArray: action.payload,
      };
    case homeworkConstants.CURRENTCHAPTERARRAY:
      return {
        ...state,
        currentChapterArray: action.payload,
      };
    case homeworkConstants.CURRENTSUBJECTARRAY:
      return {
        ...state,
        currentSubjectArray: action.payload,
      };

    case homeworkConstants.TESTISDRAFT:
      return {
        ...state,
        testIsDraft: action.payload,
      };
    case homeworkConstants.TESTCLASSSUBJECT:
      return {
        ...state,
        testClassSubject: action.payload,
      };

    case homeworkConstants.HOMEWORKLANGUAGETYPE:
      return {
        ...state,
        homeworkLanguageType: action.payload,
      };

    case homeworkConstants.CLEARTESTS:
      return {
        ...state,
        testId: null,
        currentSlide: 0,
        questionArray: [],
        selectedQuestionArray: [],
        testName: '',
        currentChapterArray: [],
        currentSubjectArray: [],
        testIsDraft: 0,
        testClassSubject: {},
        homeworkLanguageType: '',
      };
    default:
      return state;
  }
}

export const getTestId = (state) => state.homework.testId;
export const getTestName = (state) => state.homework.testName;
export const getCurrentSlide = (state) => state.homework.currentSlide;
export const getHomeworkQuestionArray = (state) => state.homework.questionArray;
export const getSelectedQuestionArray = (state) => state.homework.selectedQuestionArray;
export const getCurrentChapterArray = (state) => state.homework.currentChapterArray;
export const getCurrentSubjectArray = (state) => state.homework.currentSubjectArray;
export const getTestIsDraft = (state) => state.homework.testIsDraft;
export const getTestClassSubject = (state) => state.homework.testClassSubject;
export const getHomeworkLanguageType = (state) => state.homework.homeworkLanguageType;
