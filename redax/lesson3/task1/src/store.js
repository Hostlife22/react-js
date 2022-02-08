import { combineReducers, createStore } from 'redux';
import { counterReducer } from './counter.reducer';
import usersReducer from './users.reducer';

const appReducer = combineReducers({
  counter: counterReducer,
  users: usersReducer,
});

const store = createStore(appReducer);

export default store;
