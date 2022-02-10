import { applyMiddleware, compose, createStore } from 'redux';
import counterReducer from './counter.reducer';

const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.info(action);
  const result = next(action);
  console.log(store.getState());
  console.groupEnd;

  return result;
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  counterReducer,
  composeEnhancers(applyMiddleware(logger))
);

export default store;
