import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'connected-react-router';
import { history } from '../Routing';
import { saveState, loadState } from './localStorage';
import rootReducer from './reducers';

const loggerMiddleware = createLogger();
const persistedState = loadState();

let middleware = [routerMiddleware(history), thunkMiddleware];
if (process.env.NODE_ENV === 'development') {
  middleware = [...middleware, loggerMiddleware];
}

export const store = createStore(
  rootReducer(history),
  persistedState,
  applyMiddleware(...middleware),
);

store.subscribe(() => {
  saveState({
    branding: store.getState().branding,
    clientUserIdUpdate: store.getState().clientUserIdUpdate,
    userProfile: store.getState().userProfile,
    color: store.getState().color,
    testsUpdate: store.getState().testsUpdate,
    homework: store.getState().homework,
    course: store.getState().course,
    studyBin: store.getState().studyBin,
    fees: store.getState().fees,
    conversations: store.getState().conversations,
  });
});
