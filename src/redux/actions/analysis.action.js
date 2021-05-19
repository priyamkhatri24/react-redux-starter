import { analysisConstants } from '../../constants';

function setAnalysisAssignmentObjectToStore(payload) {
  return { type: analysisConstants.ANALYSISASSIGNMENTOBJECT, payload };
}

function setAnalysisTestObjectToStore(payload) {
  return { type: analysisConstants.ANALYSISTESTOBJECT, payload };
}

function setAnalysisStudentObjectToStore(payload) {
  return { type: analysisConstants.ANALYSISSTUDENTOBJECT, payload };
}

function setAnalysisSubjectArrayToStore(payload) {
  return { type: analysisConstants.ANALYSISSUBJECTARRAY, payload };
}

export const analysisActions = {
  setAnalysisAssignmentObjectToStore,
  setAnalysisSubjectArrayToStore,
  setAnalysisTestObjectToStore,
  setAnalysisStudentObjectToStore,
};
