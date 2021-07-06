import { analysisConstants } from '../../constants';

const initialState = {
  analysisAssignmentObject: {},
  analysisTestObject: {},
  analysisStudentObject: {},
  analysisSubjectArray: [],
};

export function analysis(state = initialState, action) {
  switch (action.type) {
    case analysisConstants.ANALYSISASSIGNMENTOBJECT:
      return {
        ...state,
        analysisAssignmentObject: action.payload,
      };

    case analysisConstants.ANALYSISTESTOBJECT:
      return {
        ...state,
        analysisTestObject: action.payload,
      };

    case analysisConstants.ANALYSISSTUDENTOBJECT:
      return {
        ...state,
        analysisStudentObject: action.payload,
      };
    case analysisConstants.ANALYSISSUBJECTARRAY:
      return {
        ...state,
        analysisSubjectArray: action.payload,
      };

    default:
      return state;
  }
}

export const getAnalysisAssignmentObject = (state) => state.analysis.analysisAssignmentObject;
export const getAnalysisTestObject = (state) => state.analysis.analysisTestObject;
export const getAnalysisStudentObject = (state) => state.analysis.analysisStudentObject;
export const getAnalysisSubjectArray = (state) => state.analysis.analysisSubjectArray;
