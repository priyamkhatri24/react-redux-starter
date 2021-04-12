import { analysisConstants } from '../../constants';

function setAnalysisAssignmentObjectToStore(payload) {
  return { type: analysisConstants.ANALYSISASSIGNMENTOBJECT, payload };
}
export const analysisActions = {
  setAnalysisAssignmentObjectToStore,
};
