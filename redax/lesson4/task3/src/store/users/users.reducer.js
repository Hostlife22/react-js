import usersList from '../../users.db';
import { ADD_USER, DELETE_USER, NEXT_PAGE, PREV_PAGE } from './users.actions';

const initialState = {
  usersList,
  currentPage: 0,
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USER:
      return {
        ...state,
        usersList: state.usersList.concat(action.payload.userData),
      };

    case DELETE_USER:
      return {
        ...state,
        usersList: state.usersList.filter(
          (user) => user.id !== action.payload.userId
        ),
      };

    case NEXT_PAGE:
      return {
        ...state,
        currentPage: state.currentPage + 1,
      };

    case PREV_PAGE:
      return {
        ...state,
        currentPage: state.currentPage - 1,
      };

    default:
      return state;
  }
};

export default usersReducer;
