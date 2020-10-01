import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { branding } from './branding.reducer';
import { clientUserIdUpdate } from './clientUserId.reducer';
import { userProfile } from './userProfile.reducer';
import { color } from './color.reducer';

const rootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    branding,
    clientUserIdUpdate,
    userProfile,
    color,
  });

export default rootReducer;
