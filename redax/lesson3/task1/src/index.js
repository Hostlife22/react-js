import { decrement, increment, reset } from './counter.actions';
import store from './store';
import { addUser, deleteUser, updateUser } from './users.actions';

store.subscribe(() => {
  console.log(store.getState());
});

store.dispatch(increment());
store.dispatch(decrement());
store.dispatch(increment());
store.dispatch(increment());
store.dispatch(reset());

store.dispatch(addUser({ id: 76, name: 'Sarah' }));
store.dispatch(addUser({ id: 77, name: 'Tom' }));

store.dispatch(deleteUser(76));
store.dispatch(updateUser(77, { name: 'Alex', age: 17 }));
