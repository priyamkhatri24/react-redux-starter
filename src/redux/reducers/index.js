import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { branding } from './branding.reducer';

const rootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    branding,
  });

export default rootReducer;
