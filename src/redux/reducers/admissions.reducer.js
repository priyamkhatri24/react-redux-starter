import { admissionConstants } from '../../constants';

const initialState = {
  admissionUserArray: [],
  admissionClassId: null,
  admissionPlanArray: [],
  admissionRoleArray: [],
  admissionPlanType: '',
  admissionBatchDate: new Date(),
  admissionBatchName: '',
  admissionBatchDescription: '',
  admissionUserProfile: {},
};

export function admission(state = initialState, action) {
  switch (action.type) {
    case admissionConstants.ADMISSIONUSERARRAY:
      return {
        ...state,
        admissionUserArray: action.payload,
      };

    case admissionConstants.ADMISSIONCLASSID:
      return {
        ...state,
        admissionClassId: action.payload,
      };

    case admissionConstants.ADMISSIONPLANARRAY:
      return {
        ...state,
        admissionPlanArray: action.payload,
      };

    case admissionConstants.ADMISSIONROLEARRAY:
      return {
        ...state,
        admissionRoleArray: action.payload,
      };

    case admissionConstants.ADMISSIONPLANTYPE:
      return {
        ...state,
        admissionPlanType: action.payload,
      };

    case admissionConstants.ADMISSIONSUBJECTARRAY:
      return {
        ...state,
        admissionSubjectArray: action.payload,
      };

    case admissionConstants.ADMISSIONBATCHDATE:
      return {
        ...state,
        admissionBatchDate: action.payload,
      };
    case admissionConstants.ADMISSIONBATCHNAME:
      return {
        ...state,
        admissionBatchName: action.payload,
      };
    case admissionConstants.ADMISSIONBATCHDESCRIPTION:
      return {
        ...state,
        admissionBatchDescription: action.payload,
      };

    case admissionConstants.ADMISSIONUSERPROFILE:
      return {
        ...state,
        admissionUserProfile: action.payload,
      };

    default:
      return state;
  }
}

export const getAdmissionClassId = (state) => state.admission.admissionClassId;
export const getAdmissionPlanArray = (state) => state.admission.admissionPlanArray;
export const getAdmissionRoleArray = (state) => state.admission.admissionRoleArray;
export const getAdmissionUserArray = (state) => state.admission.admissionUserArray;
export const getAdmissionSubjectArray = (state) => state.admission.admissionSubjectArray;
export const getAdmissionPlanType = (state) => state.admission.admissionPlanType;
export const getAdmissionBatchDate = (state) => state.admission.admissionBatchDate;
export const getAdmissionBatchDescription = (state) => state.admission.admissionBatchDescription;
export const getAdmissionBatchName = (state) => state.admission.admissionBatchName;
export const getAdmissionUserProfile = (state) => state.admission.admissionUserProfile;
