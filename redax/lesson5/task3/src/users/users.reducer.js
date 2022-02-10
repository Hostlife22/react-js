import users from './users';
import { SET_VALUE } from './users.actions';

const initialState = {
  usersList: users,
  filterText: '',
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VALUE: {
      return {
        ...state,
        filterText: action.payload.inputValue,
      };
    }

    default:
      return state;
  }
};

export default usersReducer;
