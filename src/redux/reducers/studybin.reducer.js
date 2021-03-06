import { studyBinConstants } from '../../constants';

const initialState = {
  studyBinFolderIdArray: [],
};

export function studyBin(state = initialState, action) {
  switch (action.type) {
    case studyBinConstants.FOLDERARRAY:
      return {
        ...state,
        studyBinFolderIdArray: action.payload,
      };

    case studyBinConstants.FOLDERPOP:
      return {
        ...state,
        studyBinFolderIdArray: state.studyBinFolderIdArray.slice(0, -1),
      };

    case studyBinConstants.FOLDERPUSH:
      return {
        ...state,
        studyBinFolderIdArray: [...state.studyBinFolderIdArray, action.payload],
      };

    default:
      return state;
  }
}

export const getStudyBinFolderIDArray = (state) => state.studyBin.studyBinFolderIdArray;
