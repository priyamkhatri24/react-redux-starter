import { displayConstants } from '../../constants';

function setDisplayDataToStore(payload) {
  return { type: displayConstants.DISPLAYDATA, payload };
}

export const displayActions = {
  setDisplayDataToStore,
};
