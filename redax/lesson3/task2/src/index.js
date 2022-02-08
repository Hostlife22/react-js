import { addProduct, removeProduct } from './cart.actions';
import { setLanguage } from './language.actions';
import store from './store';
import { removeUser, setUser } from './user.actions';

store.subscribe(() => {
  console.log(store.getState());
});

store.dispatch(setUser('Alex'));
store.dispatch(setLanguage('jp'));
store.dispatch(addProduct({ id: 76, name: 'milk' }));
store.dispatch(addProduct({ id: 78, name: 'bread' }));
store.dispatch(removeProduct(78));
store.dispatch(removeUser());
