import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { dashboard } from './dashboard.reducer';

const rootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    dashboard,
  });

export default rootReducer;
