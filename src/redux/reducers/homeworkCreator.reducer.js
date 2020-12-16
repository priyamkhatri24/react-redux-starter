import { homeworkConstants } from '../../constants';

const initialState = {
  testId: null,
  currentSlide: 0,
  questionArray: [],
  selectedQuestionArray: [],
};

export function homework(state = initialState, action) {
  switch (action.type) {
    case homeworkConstants.TESTID:
      return {
        ...state,
        testId: action.payload,
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
    case homeworkConstants.CLEAR:
      return {
        ...state,
        testId: null,
        currentSlide: 0,
        questionArray: [],
        selectedQuestionArray: [],
      };
    default:
      return state;
  }
}

export const getTestId = (state) => state.homework.testId;
export const getCurrentSlide = (state) => state.homework.currentSlide;
export const getHomeworkQuestionArray = (state) => state.homework.questionArray;
export const getSelectedQuestionArray = (state) => state.homework.selectedQuestionArray;
