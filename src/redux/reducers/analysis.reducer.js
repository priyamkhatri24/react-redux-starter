import { analysisConstants } from '../../constants';

const initialState = {
  analysisAssignmentObject: {},
};

export function analysis(state = initialState, action) {
  switch (action.type) {
    case analysisConstants.ANALYSISASSIGNMENTOBJECT:
      return {
        ...state,
        analysisAssignmentObject: action.payload,
      };

    default:
      return state;
  }
}

export const getAnalysisAssignmentObject = (state) => state.analysis.analysisAssignmentObject;
