import { admissionConstants } from '../../constants';

function setAdmissionClassIdToStore(payload) {
  return { type: admissionConstants.ADMISSIONCLASSID, payload };
}

function setAdmissionPlanArrayToStore(payload) {
  return { type: admissionConstants.ADMISSIONPLANARRAY, payload };
}

function setAdmissionPlanTypeToStore(payload) {
  return { type: admissionConstants.ADMISSIONPLANTYPE, payload };
}

function setAdmissionRoleArrayToStore(payload) {
  return { type: admissionConstants.ADMISSIONROLEARRAY, payload };
}

function setAdmissionSubjectArrayToStore(payload) {
  return { type: admissionConstants.ADMISSIONSUBJECTARRAY, payload };
}

function setAdmissionUserArrayToStore(payload) {
  return { type: admissionConstants.ADMISSIONUSERARRAY, payload };
}

function setAdmissionBatchNameToStore(payload) {
  return { type: admissionConstants.ADMISSIONBATCHNAME, payload };
}

function setAdmissionBatchDescriptionToStore(payload) {
  return { type: admissionConstants.ADMISSIONBATCHDESCRIPTION, payload };
}

function setAdmissionBatchDateToStore(payload) {
  return { type: admissionConstants.ADMISSIONBATCHDATE, payload };
}

function setAdmissionUserProfileToStore(payload) {
  return { type: admissionConstants.ADMISSIONUSERPROFILE, payload };
}

export const admissionActions = {
  setAdmissionClassIdToStore,
  setAdmissionPlanArrayToStore,
  setAdmissionPlanTypeToStore,
  setAdmissionRoleArrayToStore,
  setAdmissionSubjectArrayToStore,
  setAdmissionUserArrayToStore,
  setAdmissionBatchNameToStore,
  setAdmissionBatchDescriptionToStore,
  setAdmissionBatchDateToStore,
  setAdmissionUserProfileToStore,
};
