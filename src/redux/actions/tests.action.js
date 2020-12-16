import { testConstants } from '../../constants';

function setTestIdToStore(payload) {
  return { type: testConstants.TESTID, payload };
}

function setTestTypeToStore(payload) {
  return { type: testConstants.TESTTYPE, payload };
}

function setTestStartTimeToStore(payload) {
  return { type: testConstants.TESTSTARTTIME, payload };
}

function setTestEndTimeToStore(payload) {
  return { type: testConstants.TESTENDTIME, payload };
}

function setTestResultArrayToStore(payload) {
  return { type: testConstants.RESULTARRAY, payload };
}

function clearTests() {
  return { type: testConstants.CLEAR };
}

export const testsActions = {
  setTestIdToStore,
  setTestTypeToStore,
  setTestStartTimeToStore,
  setTestEndTimeToStore,
  setTestResultArrayToStore,
  clearTests,
};
