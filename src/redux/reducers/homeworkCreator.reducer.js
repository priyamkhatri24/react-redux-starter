import { homeworkConstants } from '../../constants';

const initialState = {
  testId: null,
  testName: '',
  currentSlide: 0,
  questionArray: [],
  selectedQuestionArray: [],
  currentChapterArray: [],
  currentSubjectArray: [],
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
