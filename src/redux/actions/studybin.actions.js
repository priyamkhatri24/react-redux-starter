import { studyBinConstants } from '../../constants';

function setFolderIDArrayToStore(payload) {
  return { type: studyBinConstants.FOLDERARRAY, payload };
}

function popFolderIDFromFolderIDArrayInStore() {
  return { type: studyBinConstants.FOLDERPOP };
}

function pushFolderIDToFolderIDArrayInStore(payload) {
  return { type: studyBinConstants.FOLDERPUSH, payload };
}

export const studyBinActions = {
  setFolderIDArrayToStore,
  popFolderIDFromFolderIDArrayInStore,
  pushFolderIDToFolderIDArrayInStore,
};
