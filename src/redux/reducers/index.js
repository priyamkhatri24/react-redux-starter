import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { branding } from './branding.reducer';
import { clientUserIdUpdate } from './clientUserId.reducer';
import { userProfile } from './userProfile.reducer';
import { testsUpdate } from './tests.reducer';
import { color } from './color.reducer';
import { homework } from './homeworkCreator.reducer';
import { course } from './course.reducer';
import { firstTimeLogin } from './firstTimeLogin.reducer';
import { admission } from './admissions.reducer';

const rootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    branding,
    clientUserIdUpdate,
    userProfile,
    color,
    testsUpdate,
    homework,
    course,
    firstTimeLogin,
    admission,
  });

export default rootReducer;
