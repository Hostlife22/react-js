import store from './store';
import { addUser, deleteUser } from './users.actions';

store.dispatch(addUser({ id: 76, name: 'Alex' }));
store.dispatch(addUser({ id: 78, name: 'Sarah' }));
store.dispatch(addUser({ id: 74, name: 'Sem' }));
store.dispatch(deleteUser(74));

console.log(store.getState());
