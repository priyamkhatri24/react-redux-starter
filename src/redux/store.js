import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware } from 'connected-react-router';
import { history } from '../Routing';
import { saveState, loadState } from './localStorage';

const loggerMiddleware = createLogger();
const persistedState = loadState();

export const store = createStore(
  rootReducer(history),
  persistedState,
  composeWithDevTools(
    applyMiddleware(routerMiddleware(history), thunkMiddleware, loggerMiddleware),
  ),
);

store.subscribe(() => {
  saveState({
    branding: store.getState().branding,
    clientUserIdUpdate: store.getState().clientUserIdUpdate,
  });
});
