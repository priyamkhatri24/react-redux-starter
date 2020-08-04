import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware } from 'connected-react-router';
import { history } from '../Routing';

const loggerMiddleware = createLogger();

export const store = createStore(
  rootReducer(history),

  composeWithDevTools(
    applyMiddleware(routerMiddleware(history), thunkMiddleware, loggerMiddleware),
  ),
);
