import { testConstants } from '../../constants';

const initialState = {
  testId: null,
  testType: null,
  testStartTime: 0,
  testEndTime: 0,
  testresultArray: [],
};

export function testsUpdate(state = initialState, action) {
  switch (action.type) {
    case testConstants.TESTID:
      return {
        ...state,
        testId: action.payload,
      };

    case testConstants.TESTTYPE:
      return {
        ...state,
        testType: action.payload,
      };
    case testConstants.TESTSTARTTIME:
      return {
        ...state,
        testStartTime: action.payload,
      };
    case testConstants.TESTENDTIME:
      return {
        ...state,
        testEndTime: action.payload,
      };

    case testConstants.RESULTARRAY:
      return {
        ...state,
        testresultArray: action.payload,
      };
    case testConstants.CLEARTESTS:
      return {
        ...state,
        testId: null,
        testType: null,
        testStartTime: 0,
        testEndTime: 0,
        testresultArray: [],
      };
    default:
      return state;
  }
}

export const getTestId = (state) => state.testsUpdate.testId;
export const gettestType = (state) => state.testsUpdate.testType;
export const getTestStartTime = (state) => state.testsUpdate.testStartTime;
export const getTestResultArray = (state) => state.testsUpdate.testresultArray;
export const getTestEndTime = (state) => state.testsUpdate.testEndTime;
