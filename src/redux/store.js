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

const store = createStore(rootReducer(history), persistedState, applyMiddleware(...middleware));

store.subscribe(() => {
  saveState({
    dashboard: store.getState().dashboard,
  });
});

export default store;
